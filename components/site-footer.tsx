import Link from "next/link";
import { siteConfig } from "@/config/site";

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
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
