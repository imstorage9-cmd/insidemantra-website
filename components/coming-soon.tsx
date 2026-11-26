import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Placeholder for pages that are planned but not built yet. Keeps contact options visible so no enquiry is lost. */
export function ComingSoon({ title }: { title: string }) {
  const { contact } = siteConfig;

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center sm:py-32">
      <p className="text-xs font-display font-semibold uppercase tracking-[0.25em] text-accent">{title}</p>
      <h1 className="mt-4 font-display text-5xl leading-tight font-normal tracking-tight sm:text-6xl">This page is being built</h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
        Stay tuned. We’re putting the finishing touches on it. In the meantime, we’d love to hear about your space.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a
          href={`tel:${contact.phoneDialable}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30"
        >
          <Phone size={18} /> {contact.phone}
        </a>
        <a
          href={`https://wa.me/${contact.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
        >
          <Mail size={18} /> {contact.email}
        </a>
      </div>
      <p className="mt-4 text-sm text-muted">{contact.hours}</p>

      <Link href="/" className="mt-12 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> Back to home
      </Link>
    </section>
  );
}
