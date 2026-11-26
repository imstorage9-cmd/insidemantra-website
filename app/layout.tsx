import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Montserrat, PT_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { RevealObserver } from "@/components/reveal-observer";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Same fonts as the original insidemantra.com:
// Montserrat for headings and the menu, PT Sans for body text.
const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const body = PT_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Interior Design Studio`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.hero.subheading,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint, so scroll-reveal content is hidden only when it can animate in. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        {/* Thin amber reading-progress line (pure CSS scroll timeline; hidden where unsupported) */}
        <div className="scroll-progress" aria-hidden />
        <SiteHeader />
        {/* Soft cross-fade between pages (View Transitions API; no effect where unsupported) */}
        <ViewTransition>
          <main className="flex-1">{children}</main>
        </ViewTransition>
        <SiteFooter />
        <WhatsAppButton />
        <RevealObserver />
      </body>
    </html>
  );
}
