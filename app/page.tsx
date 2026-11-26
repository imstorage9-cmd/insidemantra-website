import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  LifeBuoy,
  MapPin,
  Phone,
  Receipt,
  Wallet,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { PLACEHOLDER_SLOT, resolveImage } from "@/lib/images";
import { getProjects } from "@/lib/projects";
import { ImageSlot } from "@/components/image-slot";
import { ProjectCard } from "@/components/project-card";
import { HeroSlideshow } from "@/components/hero-slideshow";

// Config entries still holding editor placeholders ("Add number", "Add the full office
// address…") are hidden from the page until they're filled in with real information.
const isPlaceholder = (text: string) => /^add\b/i.test(text.trim());

const whyIcons = [Receipt, Wallet, CalendarCheck, BadgeCheck, LifeBuoy];

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl leading-tight font-semibold sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-7 text-muted">{intro}</p>}
    </div>
  );
}

export default function Home() {
  const {
    hero,
    offerings,
    servicesTiles,
    process,
    whyChooseUs,
    craftingSteps,
    stats,
    trophies,
    locations,
    contact,
  } = siteConfig;

  const heroSlides = Array.from({ length: hero.slideCount }, (_, i) => resolveImage(`hero/slide-${i + 1}`)).filter(
    (src): src is string => src !== null
  );
  // No hero photos yet → show the shared placeholder photo instead of a blank banner.
  const placeholder = resolveImage(PLACEHOLDER_SLOT);
  const heroImages = heroSlides.length ? heroSlides : placeholder ? [placeholder] : [];
  const realStats = stats.filter((s) => !isPlaceholder(s.value));
  const realTrophies = trophies.filter((t) => !isPlaceholder(t.title));
  const recentProjects = getProjects().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[600px] items-end sm:min-h-[720px] overflow-hidden bg-[#2b241d]">
        <HeroSlideshow images={heroImages} />
        <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pt-32 pb-16 text-white sm:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
            Interior design studio · Since {siteConfig.foundedYear}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] font-semibold sm:text-7xl">
            {hero.heading}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">{hero.subheading}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={siteConfig.consultationHref}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium transition-colors hover:bg-accent-strong"
            >
              {siteConfig.consultationCtaText} <ArrowRight size={18} />
            </Link>
            <a
              href={`tel:${contact.phoneDialable}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-medium transition-colors hover:bg-white/10"
            >
              <Phone size={18} /> {contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-28">
        <p className="font-display text-3xl leading-snug italic sm:text-4xl">“{siteConfig.tagline}”</p>
        <p className="mx-auto mt-8 max-w-2xl leading-8 text-muted">{siteConfig.mission}</p>
      </section>

      {/* Offerings */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="What we do"
            title="Interiors for every kind of space"
            intro="From a single modular kitchen to a complete home, one team takes your project from first sketch to handover."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {offerings.map((o) => (
              <article key={o.slug} className="group overflow-hidden rounded-2xl bg-background">
                <ImageSlot slot={o.image} alt={o.title} className="aspect-[16/10]" sizes="(min-width: 640px) 50vw, 100vw" />
                <div className="p-7">
                  <h3 className="font-display text-3xl font-semibold">{o.title}</h3>
                  <p className="mt-2 leading-7 text-muted">{o.longDescription}</p>
                  <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                    {o.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/offerings/${o.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-strong"
                  >
                    Learn more <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modular services */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionHeading eyebrow="Modular solutions" title="Made to fit the way you live" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {servicesTiles.map((tile) => (
            <Link key={tile.title} href={tile.href} className="group block">
              <ImageSlot slot={tile.image} alt={tile.title} className="aspect-[4/3] rounded-2xl" sizes="(min-width: 768px) 33vw, 100vw" />
              <h3 className="mt-5 flex items-center gap-2 font-display text-2xl font-semibold">
                {tile.title}
                <ArrowRight size={18} className="text-accent transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="mt-1 leading-7 text-muted">{tile.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-foreground py-20 text-[#efe8dd] sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a46c]">How it works</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Four steps to your new space</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <li key={step.title} className="border-t border-white/15 pt-6">
                <span className="font-display text-5xl text-[#d4a46c]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 leading-7 text-white/70">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose us + stats/trophies */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionHeading eyebrow="Why Inside Mantra" title="Good design, without the surprises" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {whyChooseUs.map((item, i) => {
            const Icon = whyIcons[i % whyIcons.length];
            return (
              <div key={item.title} className="rounded-2xl border border-line p-6">
                <Icon size={26} strokeWidth={1.5} className="text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>

        {(realStats.length > 0 || realTrophies.length > 0) && (
          <div className="mt-14 flex flex-wrap items-center gap-x-14 gap-y-6 border-t border-line pt-10">
            {realStats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-5xl font-semibold">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
            {realTrophies.map((t) => (
              <div key={t.title} className="flex items-center gap-3">
                <BadgeCheck size={30} strokeWidth={1.5} className="text-accent" aria-hidden />
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-muted">{t.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Crafting */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="How we build"
            title="Crafted with care, start to finish"
            intro="Every module goes through the same six stages before it reaches your home."
          />
          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {craftingSteps.map((step, i) => (
              <div key={step.title}>
                <ImageSlot slot={step.image} alt={step.title} className="aspect-[3/2] rounded-xl" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-accent">STEP {i + 1}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{step.title}</h3>
                <p className="mt-1 leading-7 text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent work (only once projects have been added via the photo admin) */}
      {recentProjects.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="The works" title="Recent projects" />
            <Link href="/the-works" className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-strong">
              View all projects <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Locations + CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="grid overflow-hidden rounded-3xl bg-accent text-white lg:grid-cols-[1.3fr_1fr]">
          <div className="p-10 sm:p-14">
            <h2 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">Let’s talk about your space</h2>
            <p className="mt-4 max-w-md leading-7 text-white/85">
              Book a free consultation. Tell us about your home, your plans and your budget, and we’ll show you what’s
              possible.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={siteConfig.consultationHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-accent-strong hover:bg-[#f6efe4]"
              >
                {siteConfig.consultationCtaText} <ArrowRight size={18} />
              </Link>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center rounded-full border border-white/50 px-6 py-3 font-medium hover:bg-white/10"
              >
                {contact.email}
              </a>
            </div>
          </div>
          <div className="space-y-5 bg-accent-strong p-10 sm:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Our studios</p>
            {locations.map((loc) => (
              <a
                key={loc.city}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 hover:opacity-80"
              >
                <MapPin size={20} className="mt-1 shrink-0" aria-hidden />
                <span>
                  <span className="block font-display text-2xl font-semibold">{loc.city}</span>
                  {!isPlaceholder(loc.address) && <span className="block text-sm text-white/80">{loc.address}</span>}
                </span>
              </a>
            ))}
            <p className="pt-2 text-sm text-white/70">{contact.hours}</p>
          </div>
        </div>
      </section>
    </>
  );
}
