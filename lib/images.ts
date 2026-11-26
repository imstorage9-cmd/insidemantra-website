import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

/** Shared stand-in photo (public/images/placeholder.jpg) used by any slot that has no photo of its own yet. */
export const PLACEHOLDER_SLOT = "placeholder";

/**
 * Looks for an image at public/images/<slot>.(jpg|jpeg|png|webp|avif).
 * Returns the public URL if found, or null so the caller can render a placeholder.
 * Runs at build time only (static export) — drop a file in and rebuild.
 */
export function resolveImage(slot: string): string | null {
  const base = path.join(PUBLIC_DIR, "images", slot);
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(base + ext)) {
      return `/images/${slot}${ext}`;
    }
  }
  return null;
}
