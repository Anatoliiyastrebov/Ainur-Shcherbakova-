import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD || "2468";

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  res.setHeader(
    "Set-Cookie",
    "admin=true; HttpOnly; Path=/; SameSite=Strict; Max-Age=3600"
  );

  return res.status(200).json({ success: true });
}
