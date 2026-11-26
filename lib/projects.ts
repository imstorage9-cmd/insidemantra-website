import fs from "node:fs";
import path from "node:path";

// Every project lives in its own folder: public/projects/<slug>/
//   index.json  – details + which photo belongs to which room (written by the /admin panel)
//   *.jpg       – the photos themselves
// The admin panel (public/admin/config.yml) is what creates and edits these folders.

const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");

/** Rooms every project gets by default, in display order. Keys match index.json and admin config. */
export const DEFAULT_ROOMS = [
  { key: "kitchen", label: "Kitchen" },
  { key: "bedroom", label: "Bedroom" },
  { key: "living_room", label: "Living Room" },
] as const;

type RoomKey = (typeof DEFAULT_ROOMS)[number]["key"];

type ProjectFile = {
  title?: string;
  location?: string;
  date?: string;
  description?: string;
  cover?: string;
  other_rooms?: { name?: string; photos?: string[] }[];
} & Partial<Record<RoomKey, string[]>>;

export type Room = { id: string; label: string; photos: string[] };

export type Project = {
  slug: string;
  title: string;
  location: string;
  date: string;
  description: string;
  cover: string | null;
  rooms: Room[]; // only rooms that actually have photos
  photoCount: number;
};

function toUrl(slug: string, file: string): string {
  // The admin stores bare file names ("IMG_01.jpg"); older/hand-written entries may use full paths.
  if (file.startsWith("/")) return file;
  return `/projects/${slug}/${file.split("/").map(encodeURIComponent).join("/")}`;
}

function cleanList(list: unknown): string[] {
  return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];
}

function slugifyRoom(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "room";
}

function readProject(slug: string): Project | null {
  const file = path.join(PROJECTS_DIR, slug, "index.json");
  if (!fs.existsSync(file)) return null;

  let data: ProjectFile;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf-8")) as ProjectFile;
  } catch {
    console.warn(`[projects] Skipping ${slug}: index.json is not valid JSON`);
    return null;
  }

  const rooms: Room[] = [];
  for (const { key, label } of DEFAULT_ROOMS) {
    const photos = cleanList(data[key]).map((f) => toUrl(slug, f));
    if (photos.length) rooms.push({ id: key.replace("_", "-"), label, photos });
  }
  for (const extra of data.other_rooms ?? []) {
    const label = extra.name?.trim();
    const photos = cleanList(extra.photos).map((f) => toUrl(slug, f));
    if (label && photos.length) rooms.push({ id: slugifyRoom(label), label, photos });
  }

  const allPhotos = rooms.flatMap((r) => r.photos);
  const cover = data.cover ? toUrl(slug, data.cover) : (allPhotos[0] ?? null);

  return {
    slug,
    title: data.title?.trim() || slug,
    location: data.location?.trim() ?? "",
    date: data.date ?? "",
    description: data.description?.trim() ?? "",
    cover,
    rooms,
    photoCount: allPhotos.length,
  };
}

/** All projects that have at least one photo, newest first. Runs at build time. */
export function getProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => readProject(e.name))
    .filter((p): p is Project => p !== null && p.photoCount > 0)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
