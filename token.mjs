import { AccessToken } from "livekit-server-sdk";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405, headers: { "Content-Type": "application/json", "Allow": "POST" }
    });
  }
  try {
    const { room, identity } = await req.json();
    if (typeof room !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(room)) {
      return new Response(JSON.stringify({ error: "Room ID එක වලංගු නැහැ." }), { status: 400 });
    }
    const safeIdentity = String(identity || "Guest").trim().slice(0, 40) || "Guest";
    const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return new Response(JSON.stringify({ error: "Netlify Environment Variables සකස් කර නැහැ." }), { status: 500 });
    }
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: `${safeIdentity}-${crypto.randomUUID().slice(0, 8)}`,
      ttl: "2h"
    });
    token.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true });
    const jwt = await token.toJwt();
    return new Response(JSON.stringify({ token: jwt, url: LIVEKIT_URL }), {
      status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Token සෑදීම අසාර්ථකයි." }), { status: 500 });
  }
};