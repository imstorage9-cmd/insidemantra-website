"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-7 text-sm lg:flex" aria-label="Main">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <Link
            href={siteConfig.consultationHref}
            className="rounded-full bg-accent px-5 py-2 font-medium text-white transition-colors hover:bg-accent-strong"
          >
            {siteConfig.consultationCtaText}
          </Link>
        </nav>

        <button
          type="button"
          className="p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line px-5 pb-5 lg:hidden" aria-label="Mobile">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-3 text-sm"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={siteConfig.consultationHref}
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white"
          >
            {siteConfig.consultationCtaText}
          </Link>
        </nav>
      )}
    </header>
  );
}
