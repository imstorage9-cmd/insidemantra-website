import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { LogoMark } from "@/components/logo-mark";
import { delay } from "@/lib/motion";

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  pinterest: "Pinterest",
  houzz: "Houzz",
};

const heading = "text-xs font-display font-semibold uppercase tracking-[0.22em] text-brand";
const linkCls = "group inline-flex items-center gap-1.5 transition-colors hover:text-white";
const arrow = (
  <ArrowRight
    size={13}
    className="-ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100"
    aria-hidden
  />
);

export function SiteFooter() {
  const { contact, social, footerLinks, locations } = siteConfig;

  return (
    <footer className="bg-charcoal text-[#c9c9cc]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr]">
        <div data-reveal>
          <Link href="/" className="group inline-flex items-center gap-3" aria-label={`${siteConfig.name} home`}>
            <LogoMark className="h-14 w-14 transition-transform duration-500 group-hover:rotate-[30deg]" />
            <span className="font-display text-xl leading-tight font-light tracking-[0.18em] text-white uppercase">
              Inside
              <br />
              Mantra
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6">{siteConfig.philosophy}</p>
        </div>

        <div data-reveal style={delay(80)}>
          <p className={heading}>Explore</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={linkCls}>
                  {arrow}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal style={delay(160)}>
          <p className={heading}>Contact</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={`tel:${contact.phoneDialable}`} className={linkCls}>
                <Phone size={15} className="text-brand" aria-hidden /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className={linkCls}>
                <Mail size={15} className="text-brand" aria-hidden /> {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <Clock size={15} className="text-brand" aria-hidden /> {contact.hours}
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin size={15} className="text-brand" aria-hidden /> {locations.map((l) => l.city).join(" · ")}
            </li>
          </ul>
        </div>

        <div data-reveal style={delay(240)}>
          <p className={heading}>Follow</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            {Object.entries(social).map(([key, href]) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-white/15 px-4 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-charcoal"
                >
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
        </div>
      </div>
    </footer>
  );
}
