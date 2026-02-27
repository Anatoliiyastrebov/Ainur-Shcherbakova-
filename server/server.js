import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

const CONTENT_PATH = path.join(__dirname, "content.json");
const BACKUP_DIR = path.join(__dirname, "backup");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

if (!fs.existsSync(CONTENT_PATH)) {
  fs.writeFileSync(
    CONTENT_PATH,
    JSON.stringify(
      {
        welcomeTitle: "Добро пожаловать",
      },
      null,
      2
    ),
    "utf8"
  );
}

const readContent = () => {
  const raw = fs.readFileSync(CONTENT_PATH, "utf8");
  return JSON.parse(raw);
};

const checkAdmin = (req, res, next) => {
  if (req.cookies?.admin === "true") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

app.post("/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  res.cookie("admin", "true", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  return res.json({ success: true });
});

app.post("/admin/logout", (req, res) => {
  res.clearCookie("admin", {
    httpOnly: true,
    sameSite: "strict",
  });
  return res.json({ success: true });
});

app.get("/admin/status", (req, res) => {
  return res.json({ isAdmin: req.cookies?.admin === "true" });
});

app.get("/content", (_req, res) => {
  try {
    return res.json(readContent());
  } catch (error) {
    return res.status(500).json({ error: "Failed to read content" });
  }
});

app.post("/content", checkAdmin, (req, res) => {
  try {
    const current = readContent();
    const backupName = `content-${Date.now()}.json`;
    fs.writeFileSync(path.join(BACKUP_DIR, backupName), JSON.stringify(current, null, 2), "utf8");

    const nextContent = { ...current, ...(req.body || {}) };
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(nextContent, null, 2), "utf8");
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save content" });
  }
});

const staticCandidates = [path.join(projectRoot, "build"), path.join(projectRoot, "dist")];
const staticDir = staticCandidates.find((dir) => fs.existsSync(dir));

if (staticDir) {
  app.use(express.static(staticDir));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

const requestedPort = Number(process.env.PORT || 8080);
const server = app.listen(requestedPort, () => {
  const { port } = server.address();
  console.log(`Server started on http://localhost:${port}`);
});
