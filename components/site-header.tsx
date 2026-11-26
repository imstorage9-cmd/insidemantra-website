"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the page changes (adjusting state during render, per React docs)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur transition-all duration-300 ${
        scrolled ? "border-line shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)]" : "border-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link href="/" aria-label={`${siteConfig.name} home`} className="group shrink-0">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={720}
            height={286}
            preload
            className={`w-auto transition-all duration-300 group-hover:scale-[1.03] ${scrolled ? "h-10" : "h-12"}`}
          />
        </Link>

        <nav className="hidden items-center gap-7 font-display text-[11px] font-normal tracking-[0.22em] uppercase lg:flex" aria-label="Main">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative py-2 transition-colors ${isActive(item.href) ? "text-foreground" : "text-muted hover:text-foreground"}`}
            >
              {item.label}
              <span
                className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ${
                  isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
          <Link
            href={siteConfig.consultationHref}
            className="group inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 font-semibold text-charcoal shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30"
          >
            {siteConfig.consultationCtaText}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-full p-2 transition-colors hover:bg-surface lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`grid overflow-hidden border-t border-line transition-all duration-300 lg:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] border-transparent opacity-0"
        }`}
      >
        <nav className="min-h-0 px-5" aria-label="Mobile">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between border-b border-line py-3.5 font-display text-xs tracking-[0.2em] uppercase transition-colors hover:text-accent ${
                isActive(item.href) ? "text-accent" : ""
              }`}
            >
              {item.label} <ArrowRight size={16} className="text-muted" />
            </Link>
          ))}
          <Link
            href={siteConfig.consultationHref}
            className="my-5 block rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-charcoal"
          >
            {siteConfig.consultationCtaText}
          </Link>
        </nav>
      </div>
    </header>
  );
}
