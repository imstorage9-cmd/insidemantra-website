// Inside Mantra – local photo admin.
// Run with `npm run admin`, then open http://localhost:3001
//
// Password-protected page for adding project photos. Everything is saved straight into
// public/projects/<project>/ (photos + index.json), which the website reads (see lib/projects.ts).
// Uses only Node built-ins: no extra packages to install.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PROJECTS_DIR = path.join(ROOT, "public", "projects");
const UI_DIR = path.join(ROOT, "scripts", "admin");
const HOST = "127.0.0.1"; // this computer only
const PORT = Number(process.env.ADMIN_PORT) || 3001;
const BASE = "/admin"; // URL prefix; the preview forwards localhost:3000/admin/* here
const SITE_PORT = 3000; // `npm run dev`
const ALLOWED_ORIGINS = new Set(
  [PORT, SITE_PORT].flatMap((port) => [`http://localhost:${port}`, `http://127.0.0.1:${port}`])
);
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const SESSION_HOURS = 12;

// Must match DEFAULT_ROOMS in lib/projects.ts
const DEFAULT_ROOMS = [
  { key: "kitchen", label: "Kitchen" },
  { key: "bedroom", label: "Bedroom" },
  { key: "living_room", label: "Living Room" },
];
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// ── Password (from .env.local, never committed) ───────────────────────────
function readEnvFile(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return out;
}
const PASSWORD = process.env.ADMIN_PASSWORD || readEnvFile(path.join(ROOT, ".env.local")).ADMIN_PASSWORD;
if (!PASSWORD) {
  console.error(
    "\n  No admin password set.\n" +
      "  Create a file named .env.local in the project folder containing:\n\n" +
      "    ADMIN_PASSWORD=choose-a-password\n\n" +
      "  then run `npm run admin` again.\n"
  );
  process.exit(1);
}

const sessions = new Map(); // token -> expiry ms
function passwordMatches(input) {
  const a = crypto.createHash("sha256").update(String(input)).digest();
  const b = crypto.createHash("sha256").update(PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}
function getSession(req) {
  const token = /(?:^|;\s*)im_admin=([a-f0-9]{64})/.exec(req.headers.cookie ?? "")?.[1];
  const exp = token && sessions.get(token);
  if (!exp || exp < Date.now()) return null;
  return token;
}

// ── Project storage helpers ───────────────────────────────────────────────
const slugify = (s) =>
  String(s).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

function projectDir(slug) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw httpError(400, "Invalid project");
  return path.join(PROJECTS_DIR, slug);
}
function readProject(slug) {
  const file = path.join(projectDir(slug), "index.json");
  if (!fs.existsSync(file)) throw httpError(404, "Project not found");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}
function writeProject(slug, data) {
  const file = path.join(projectDir(slug), "index.json");
  fs.writeFileSync(file + ".tmp", JSON.stringify(data, null, 2) + "\n");
  fs.renameSync(file + ".tmp", file);
}
function normalize(data) {
  for (const { key } of DEFAULT_ROOMS) if (!Array.isArray(data[key])) data[key] = [];
  if (!Array.isArray(data.other_rooms)) data.other_rooms = [];
  return data;
}
/** room id: "kitchen" | "bedroom" | "living_room" | "other:<name>" -> the photo array in data */
function roomList(data, room) {
  if (DEFAULT_ROOMS.some((r) => r.key === room)) return data[room];
  if (room?.startsWith("other:")) {
    const name = room.slice(6).trim().toLowerCase();
    const extra = data.other_rooms.find((r) => (r.name ?? "").trim().toLowerCase() === name);
    if (extra) return (extra.photos ??= []);
  }
  throw httpError(400, "Unknown room");
}
function summary(slug, data) {
  return {
    slug,
    title: data.title ?? slug,
    location: data.location ?? "",
    date: data.date ?? "",
    description: data.description ?? "",
    cover: data.cover ?? "",
    rooms: [
      ...DEFAULT_ROOMS.map((r) => ({ id: r.key, label: r.label, photos: data[r.key], isDefault: true })),
      ...data.other_rooms.map((r) => ({ id: `other:${r.name}`, label: r.name, photos: r.photos ?? [], isDefault: false })),
    ],
  };
}
function listProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(PROJECTS_DIR, e.name, "index.json")))
    .map((e) => {
      try {
        const s = summary(e.name, normalize(readProject(e.name)));
        return { slug: s.slug, title: s.title, location: s.location, date: s.date, photoCount: s.rooms.reduce((n, r) => n + r.photos.length, 0) };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
function uniqueFileName(dir, wanted) {
  const ext = path.extname(wanted).toLowerCase();
  const base = slugify(path.basename(wanted, path.extname(wanted))) || "photo";
  let name = `${base}${ext}`;
  for (let i = 2; fs.existsSync(path.join(dir, name)); i++) name = `${base}-${i}${ext}`;
  return name;
}
const isUsedElsewhere = (data, file) =>
  [...DEFAULT_ROOMS.map((r) => data[r.key]), ...data.other_rooms.map((r) => r.photos ?? [])].some((l) => l.includes(file)) ||
  data.cover === file;

// ── HTTP plumbing ─────────────────────────────────────────────────────────
function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}
function send(res, status, body, headers = {}) {
  const isJson = typeof body !== "string" && !Buffer.isBuffer(body);
  res.writeHead(status, {
    "Content-Type": isJson ? "application/json; charset=utf-8" : "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Frame-Options": "DENY",
    ...headers,
  });
  res.end(isJson ? JSON.stringify(body) : body);
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(httpError(413, "File too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
const readJson = async (req) => {
  try {
    return JSON.parse((await readBody(req, 64 * 1024)).toString("utf-8") || "{}");
  } catch {
    throw httpError(400, "Bad request");
  }
};
const page = (name) => fs.readFileSync(path.join(UI_DIR, name), "utf-8");
const today = () => new Date().toISOString().slice(0, 10);

// ── Routes ────────────────────────────────────────────────────────────────
async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Everything lives under /admin/, so it works both directly (localhost:3001/admin/) and through
  // the website preview, which forwards localhost:3000/admin/* here (see next.config.ts).
  if (!(url.pathname + "/").startsWith(BASE + "/")) {
    if (req.method === "GET") return send(res, 302, "", { Location: `${BASE}/` });
    throw httpError(404, "Not found");
  }
  let p = url.pathname.slice(BASE.length) || "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1); // the preview adds trailing slashes

  // Same-origin check for every state-changing request (blocks other websites posting here).
  if (req.method !== "GET" && req.headers.origin && !ALLOWED_ORIGINS.has(req.headers.origin)) {
    throw httpError(403, "Forbidden");
  }

  if (req.method === "POST" && p === "/login") {
    const form = new URLSearchParams((await readBody(req, 4096)).toString("utf-8"));
    if (!passwordMatches(form.get("password") ?? "")) {
      await new Promise((r) => setTimeout(r, 800)); // slow down guessing
      return send(res, 303, "", { Location: `${BASE}/?error=1` });
    }
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, Date.now() + SESSION_HOURS * 3600_000);
    return send(res, 303, "", {
      Location: `${BASE}/`,
      "Set-Cookie": `im_admin=${token}; HttpOnly; SameSite=Strict; Path=${BASE}; Max-Age=${SESSION_HOURS * 3600}`,
    });
  }

  const session = getSession(req);
  if (!session) {
    if (p.startsWith("/api/") || p.startsWith("/photos/")) throw httpError(401, "Please log in again");
    return send(res, 200, page("login.html"));
  }

  if (req.method === "POST" && p === "/logout") {
    sessions.delete(session);
    return send(res, 303, "", { Location: `${BASE}/`, "Set-Cookie": `im_admin=; Path=${BASE}; Max-Age=0` });
  }
  if (req.method === "GET" && p === "/") return send(res, 200, page("app.html"));

  // Photo thumbnails: /photos/<slug>/<file>
  let m = p.match(/^\/photos\/([a-z0-9-]+)\/([^/]+)$/);
  if (req.method === "GET" && m) {
    const file = path.join(projectDir(m[1]), decodeURIComponent(m[2]));
    if (path.dirname(file) !== projectDir(m[1]) || !fs.existsSync(file)) throw httpError(404, "Not found");
    const ext = path.extname(file).toLowerCase();
    const type = { ".png": "image/png", ".webp": "image/webp" }[ext] ?? "image/jpeg";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "private, max-age=3600" });
    return fs.createReadStream(file).pipe(res);
  }

  if (req.method === "GET" && p === "/api/projects") return send(res, 200, listProjects());

  // Create a new project → folder + index.json with the three default rooms
  if (req.method === "POST" && p === "/api/projects") {
    const { title, location = "", description = "" } = await readJson(req);
    const name = String(title ?? "").trim();
    if (name.length < 2) throw httpError(400, "Please enter a project name");
    const slug = slugify(name);
    if (!slug) throw httpError(400, "Project name needs at least one letter or number");
    if (fs.existsSync(projectDir(slug))) throw httpError(409, `A project called “${name}” already exists. Pick it from the list instead.`);
    fs.mkdirSync(projectDir(slug), { recursive: true });
    const data = normalize({ title: name, location: String(location).trim(), date: today(), description: String(description).trim() });
    writeProject(slug, data);
    return send(res, 201, summary(slug, data));
  }

  m = p.match(/^\/api\/projects\/([a-z0-9-]+)(\/.*)?$/);
  if (!m) throw httpError(404, "Not found");
  const slug = m[1];
  const sub = m[2] ?? "";
  const data = normalize(readProject(slug));

  if (req.method === "GET" && sub === "") return send(res, 200, summary(slug, data));

  // Edit details (name, city, description, cover)
  if (req.method === "PATCH" && sub === "") {
    const body = await readJson(req);
    let newSlug = slug;
    if (typeof body.title === "string") {
      const name = body.title.trim().replace(/\s+/g, " ");
      if (name.length < 2) throw httpError(400, "Please enter a project name");
      newSlug = slugify(name);
      if (!newSlug) throw httpError(400, "Project name needs at least one letter or number");
      if (newSlug !== slug && fs.existsSync(projectDir(newSlug))) {
        throw httpError(409, `Another project already uses the name “${name}”. Please choose a different name.`);
      }
      data.title = name;
    }
    if (typeof body.location === "string") data.location = body.location.trim();
    if (typeof body.description === "string") data.description = body.description.trim();
    if (typeof body.cover === "string") data.cover = body.cover;

    // A new name also renames the folder, so the web address matches the name.
    if (newSlug !== slug) {
      try {
        fs.renameSync(projectDir(slug), projectDir(newSlug));
      } catch (err) {
        console.error(err);
        throw httpError(409, "Couldn't rename the project folder. It may be open in another program. Close it and try again.");
      }
    }
    writeProject(newSlug, data);
    return send(res, 200, summary(newSlug, data));
  }

  // Delete the whole project: its folder, details and all photos (permanent)
  if (req.method === "DELETE" && sub === "") {
    try {
      fs.rmSync(projectDir(slug), { recursive: true, force: true });
    } catch (err) {
      console.error(err);
      throw httpError(409, "Couldn't delete the project folder. It may be open in another program. Close it and try again.");
    }
    console.log(`  Deleted project: ${slug}`);
    return send(res, 200, { deleted: slug });
  }

  // Add an extra room (Pooja Room, Balcony, ...)
  if (req.method === "POST" && sub === "/rooms") {
    const name = String((await readJson(req)).name ?? "").trim().replace(/\s+/g, " ");
    if (!name) throw httpError(400, "Please enter a room name");
    const all = [...DEFAULT_ROOMS.map((r) => r.label), ...data.other_rooms.map((r) => r.name)];
    if (all.some((n) => n.toLowerCase() === name.toLowerCase())) throw httpError(409, `“${name}” already exists in this project`);
    data.other_rooms.push({ name, photos: [] });
    writeProject(slug, data);
    return send(res, 201, summary(slug, data));
  }

  // Upload one photo (raw bytes) into a room
  if (req.method === "PUT" && sub === "/photos") {
    const list = roomList(data, url.searchParams.get("room"));
    const wanted = url.searchParams.get("name") || "photo.jpg";
    if (!IMAGE_EXT.has(path.extname(wanted).toLowerCase())) throw httpError(400, "Only JPG, PNG or WebP photos");
    const bytes = await readBody(req, MAX_UPLOAD_BYTES);
    if (bytes.length < 100) throw httpError(400, "Empty file");
    const dir = projectDir(slug);
    const fileName = uniqueFileName(dir, wanted);
    fs.writeFileSync(path.join(dir, fileName), bytes);
    list.push(fileName);
    writeProject(slug, data);
    return send(res, 201, summary(slug, data));
  }

  // Remove a photo from a room (deletes the file if nothing else uses it)
  if (req.method === "DELETE" && sub === "/photos") {
    const list = roomList(data, url.searchParams.get("room"));
    const file = url.searchParams.get("file");
    const i = list.indexOf(file);
    if (i === -1) throw httpError(404, "Photo not found");
    list.splice(i, 1);
    if (data.cover === file) data.cover = "";
    if (!isUsedElsewhere(data, file)) fs.rmSync(path.join(projectDir(slug), path.basename(file)), { force: true });
    writeProject(slug, data);
    return send(res, 200, summary(slug, data));
  }

  // Remove an empty extra room
  if (req.method === "DELETE" && sub === "/rooms") {
    const room = url.searchParams.get("room") ?? "";
    const list = roomList(data, room);
    if (!room.startsWith("other:")) throw httpError(400, "Default rooms can't be removed. Leave them empty to hide them.");
    if (list.length) throw httpError(400, "Remove this room's photos first");
    data.other_rooms = data.other_rooms.filter((r) => `other:${r.name}` !== room);
    writeProject(slug, data);
    return send(res, 200, summary(slug, data));
  }

  throw httpError(404, "Not found");
}

http
  .createServer((req, res) => {
    handle(req, res).catch((err) => {
      if (!err.status) console.error(err);
      if (!res.headersSent) send(res, err.status ?? 500, { error: err.status ? err.message : "Something went wrong" });
    });
  })
  .listen(PORT, HOST, () => {
    console.log(`\n  Inside Mantra photo admin → http://localhost:${SITE_PORT}/admin/  (or http://localhost:${PORT}/admin/)\n  Saving into ${PROJECTS_DIR}\n`);
  });
