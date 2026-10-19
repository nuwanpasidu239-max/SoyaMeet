
import { AccessToken } from "livekit-server-sdk";

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const { room, identity } = await req.json();

    if (
      typeof room !== "string" ||
      typeof identity !== "string" ||
      !room.trim() ||
      !identity.trim() ||
      room.length > 80 ||
      identity.length > 40
    ) {
      return Response.json(
        { error: "Invalid room or name" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const url = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !url) {
      return Response.json(
        { error: "LiveKit environment variables missing" },
        { status: 500 }
      );
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: identity.trim(),
      ttl: "1h"
    });

    token.addGrant({
      roomJoin: true,
      room: room.trim(),
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    });

    const jwt = await token.toJwt();

    return Response.json({
      url,
      token: jwt
    });
  } catch {
    return Response.json(
      { error: "Unable to create meeting token" },
      { status: 500 }
    );
  }
};
