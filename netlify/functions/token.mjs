
import { AccessToken } from "livekit-server-sdk";

const GOOGLE_CLIENT_ID =
  "269410892729-vcigf2mk2o0u55ls5o6gte6sunb11fev.apps.googleusercontent.com";

async function verifyGoogleCredential(credential) {
  if (!credential) {
    throw new Error("Google sign-in is required.");
  }

  const response = await fetch(
    "https://oauth2.googleapis.com/tokeninfo?id_token=" +
    encodeURIComponent(credential)
  );

  if (!response.ok) {
    throw new Error("Invalid Google sign-in. Please sign in again.");
  }

  const user = await response.json();

  if (
    user.aud !== GOOGLE_CLIENT_ID ||
    user.email_verified !== "true" ||
    !user.email
  ) {
    throw new Error("Google account verification failed.");
  }

  return {
    name: user.name || user.email.split("@")[0],
    email: user.email,
    picture: user.picture || ""
  };
}

export default async (request) => {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed." },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();
    const user = await verifyGoogleCredential(
      body.googleCredential
    );

    if (body.action === "verify") {
      return Response.json({ user });
    }

    if (body.action !== "join") {
      return Response.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    const room = String(body.room || "").trim();

    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(room)) {
      return Response.json(
        { error: "Invalid meeting room ID." },
        { status: 400 }
      );
    }

    const LIVEKIT_URL = process.env.LIVEKIT_URL;
    const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
    const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      throw new Error("LiveKit environment variables are missing.");
    }

    const token = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      {
        identity: user.email.toLowerCase(),
        name: user.name,
        ttl: "2h"
      }
    );

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    });

    const jwt = await token.toJwt();

    return Response.json({
      url: LIVEKIT_URL,
      token: jwt
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to join the meeting." },
      { status: 401 }
    );
  }
};
