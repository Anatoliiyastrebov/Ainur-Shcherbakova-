import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "server", "content.json");
const BACKUP_DIR = path.join(process.cwd(), "server", "backup");

const defaultContent = {
  welcomeTitle: "Добро пожаловать",
  siteTitle: "Анкета по здоровью",
  welcomeDescription:
    "Это бесплатная анкета по здоровью. Заполните форму, и мы свяжемся с вами для консультации.",
  selectCategory: "Выберите категорию анкеты",
};

let contentCache: Record<string, string> = { ...defaultContent };

const hasAdminCookie = (cookieHeader?: string): boolean => {
  if (!cookieHeader) return false;
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .includes("admin=true");
};

const ensureContentFile = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  if (!fs.existsSync(CONTENT_PATH)) {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(defaultContent, null, 2), "utf8");
  }
};

const readContent = () => {
  try {
    ensureContentFile();
    const raw = fs.readFileSync(CONTENT_PATH, "utf8");
    contentCache = JSON.parse(raw);
    return contentCache;
  } catch (_error) {
    // If filesystem is unavailable (some serverless envs), return in-memory cache.
    return contentCache;
  }
};

const writeContent = (nextContent: Record<string, string>) => {
  contentCache = nextContent;
  try {
    ensureContentFile();
    const backupName = `content-${Date.now()}.json`;
    fs.writeFileSync(path.join(BACKUP_DIR, backupName), JSON.stringify(readContent(), null, 2), "utf8");
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(nextContent, null, 2), "utf8");
  } catch (_error) {
    // In memory fallback is already updated via contentCache.
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json(readContent());
  }

  if (req.method === "POST") {
    if (!hasAdminCookie(req.headers.cookie)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const current = readContent();
    const nextContent = { ...current, ...(req.body || {}) };
    writeContent(nextContent);
    return res.status(200).json({ success: true, content: nextContent });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
