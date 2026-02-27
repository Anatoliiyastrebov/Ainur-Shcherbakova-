import type { VercelRequest, VercelResponse } from "@vercel/node";

const hasAdminCookie = (cookieHeader?: string): boolean => {
  if (!cookieHeader) return false;
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .includes("admin=true");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookieHeader = req.headers.cookie;
  return res.status(200).json({ isAdmin: hasAdminCookie(cookieHeader) });
}
