import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const ADMIN_SERVER = "http://127.0.0.1:3001"; // `npm run admin`

export default function config(phase: string): NextConfig {
  const base: NextConfig = {
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };

  // Local preview (`npm run dev`): forward /admin/* to the photo admin so it opens at
  // http://localhost:3000/admin/. Rewrites can't exist in a static export, so this is dev-only.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...base,
      async rewrites() {
        return [
          { source: "/admin/", destination: `${ADMIN_SERVER}/admin/` },
          { source: "/admin/:path*", destination: `${ADMIN_SERVER}/admin/:path*` },
        ];
      },
    };
  }

  // Production build (`npm run build`): plain static files in out/.
  return { ...base, output: "export" };
}
