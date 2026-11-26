import Link from "next/link";
import { Lock } from "lucide-react";
import { siteConfig } from "@/config/site";

// The photo admin (`npm run admin`) only runs on this computer, so its link is shown
// in the local preview (`npm run dev`) and left out of the published build.
const showAdminLink = process.env.NODE_ENV === "development";
const ADMIN_URL = "/admin/"; // forwarded to the admin server by next.config.ts (dev only)

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  pinterest: "Pinterest",
  houzz: "Houzz",
};

export function SiteFooter() {
  const { contact, social, footerLinks, locations } = siteConfig;

  return (
    <footer className="bg-foreground text-[#d9d1c5]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold text-white">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-6">{siteConfig.philosophy}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${contact.phoneDialable}`} className="hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li>{contact.hours}</li>
            <li>{locations.map((l) => l.city).join(" · ")}</li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Follow</p>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(social).map(([key, href]) => (
              <li key={key}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {socialLabels[key] ?? key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          {showAdminLink && (
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-16 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 hover:border-white/50 hover:text-white"
            >
              <Lock size={12} aria-hidden /> Admin login
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
