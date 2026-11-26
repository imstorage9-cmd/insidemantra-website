import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronDown,
  LifeBuoy,
  MapPin,
  Phone,
  Receipt,
  Wallet,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { PLACEHOLDER_SLOT, resolveImage } from "@/lib/images";
import { getProjects } from "@/lib/projects";
import { delay } from "@/lib/motion";
import { ImageSlot } from "@/components/image-slot";
import { ProjectCard } from "@/components/project-card";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { PhilosophySlider } from "@/components/philosophy-slider";
import { WordRotator } from "@/components/word-rotator";
import { LogoMark } from "@/components/logo-mark";
import { SplitWords } from "@/components/split-words";

// Config entries still holding editor placeholders ("Add number", "Add the full office
// address…") are hidden from the page until they're filled in with real information.
const isPlaceholder = (text: string) => /^add\b/i.test(text.trim());

const whyIcons = [Receipt, Wallet, CalendarCheck, BadgeCheck, LifeBuoy];

function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl" data-reveal>
      <p className={`flex items-center gap-3 text-xs font-display font-semibold uppercase tracking-[0.25em] ${light ? "text-brand" : "text-accent"}`}>
        <span className="h-px w-8 bg-brand" aria-hidden />
        {eyebrow}
      </p>
      <SplitWords
        text={title}
        reveal
        delayMs={120}
        className={`mt-4 font-display text-4xl leading-tight font-normal tracking-tight sm:text-5xl ${light ? "text-white" : ""}`}
      />
      {intro && <p className={`mt-4 text-base leading-7 ${light ? "text-white/70" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}

const btnPrimary =
  "group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-charcoal shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/30";
const arrowNudge = "transition-transform duration-300 group-hover:translate-x-1";

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
    philosophyQuotes,
    beYou,
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
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {/* overflow-clip (not hidden): hidden would make the hero its own scroll container and freeze the scroll-driven drift */}
      <section className="relative isolate flex min-h-[620px] items-end overflow-clip bg-charcoal sm:min-h-[min(calc(100svh-5rem),56rem)]">
        <HeroSlideshow images={heroImages} />
        <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-black/50 to-transparent" />

        <div className="hero-drift relative mx-auto w-full max-w-6xl px-5 pt-32 pb-20 text-white sm:pb-28">
          <p className="animate-fade-up flex items-center gap-3 text-xs font-display font-semibold uppercase tracking-[0.3em] text-brand" style={delay(100)}>
            <span className="h-px w-10 bg-brand" aria-hidden />
            Interior design studio · Since {siteConfig.foundedYear}
          </p>
          <SplitWords
            as="h1"
            text={hero.heading}
            onLoad
            delayMs={200}
            className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] font-normal tracking-tight sm:text-7xl"
          />
          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-8 text-white/85" style={delay(400)}>
            {hero.subheading}
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap gap-3" style={delay(550)}>
            <Link href={siteConfig.consultationHref} className={btnPrimary}>
              {siteConfig.consultationCtaText} <ArrowRight size={18} className={arrowNudge} />
            </Link>
            <a
              href={`tel:${contact.phoneDialable}`}
              className="group inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-charcoal"
            >
              <Phone size={18} className="transition-transform duration-300 group-hover:rotate-12" /> {contact.phone}
            </a>
          </div>
        </div>

        <a
          href="#philosophy"
          aria-label="Scroll down"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] tracking-[0.3em] text-white/70 uppercase transition-colors hover:text-brand sm:flex"
        >
          Scroll
          <ChevronDown size={20} className="animate-scroll-cue" />
        </a>
      </section>

      {/* ── Philosophy (rotating quotes) ─────────────────────────────────── */}
      <section id="philosophy" className="relative overflow-hidden px-5 py-24 sm:py-32">
        <LogoMark spin className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 opacity-[0.07] sm:h-[28rem] sm:w-[28rem]" />
        <LogoMark className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 opacity-[0.05]" />
        <div className="relative mx-auto max-w-4xl" data-reveal>
          <PhilosophySlider quotes={philosophyQuotes} />
        </div>
        <p className="relative mx-auto mt-14 max-w-2xl text-center leading-8 text-muted" data-reveal style={delay(150)}>
          {siteConfig.mission}
        </p>
      </section>

      {/* ── Offerings ────────────────────────────────────────────────────── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="What we do"
            title="Interiors for every kind of space"
            intro="From a single modular kitchen to a complete home, one team takes your project from first sketch to handover."
          />
          <div className="mt-14 grid gap-7 sm:grid-cols-2">
            {offerings.map((o, i) => (
              <article
                key={o.slug}
                data-reveal
                style={delay((i % 2) * 120)}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10"
              >
                <div className="relative">
                  <ImageSlot
                    slot={o.image}
                    alt={o.title}
                    className="aspect-[16/10]"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    zoomOnHover
                    curtain
                    revealDelay={150 + (i % 2) * 120}
                  />
                  <span className="hexagon absolute right-5 -bottom-7 flex h-14 w-14 items-center justify-center bg-brand font-display text-lg font-semibold text-charcoal transition-transform duration-500 group-hover:rotate-[30deg]">
                    <span className="transition-transform duration-500 group-hover:-rotate-[30deg]">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="font-display text-3xl font-normal">{o.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{o.longDescription}</p>
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
                    className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-accent after:absolute after:inset-0"
                  >
                    Learn more <ArrowRight size={16} className={arrowNudge} />
                  </Link>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Be You banner ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand px-5 py-20 text-charcoal sm:py-24">
        <LogoMark className="pointer-events-none absolute top-1/2 -right-16 h-72 w-72 -translate-y-1/2 opacity-20 mix-blend-overlay" spin />
        <div className="relative mx-auto max-w-6xl" data-reveal>
          <p className="max-w-xl text-lg leading-8 font-medium">{beYou.lead}</p>
          <p className="mt-6 font-display text-6xl leading-none font-normal tracking-tight sm:text-8xl">
            Be <WordRotator words={beYou.words} className="font-semibold" />
          </p>
        </div>
      </section>

      {/* ── Modular services ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionHeading eyebrow="Modular solutions" title="Made to fit the way you live" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {servicesTiles.map((tile, i) => (
            <Link
              key={tile.title}
              href={tile.href}
              data-reveal
              style={delay(i * 120)}
              className="group relative block overflow-hidden rounded-3xl shadow-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/15"
            >
              <ImageSlot slot={tile.image} alt={tile.title} className="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" zoomOnHover />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <h3 className="flex items-center justify-between font-display text-3xl font-normal tracking-tight">
                  {tile.title}
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-charcoal transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight size={20} />
                  </span>
                </h3>
                <p className="grid grid-rows-[0fr] text-sm leading-6 text-white/85 transition-all duration-500 group-hover:mt-3 group-hover:grid-rows-[1fr] group-focus-visible:mt-3 group-focus-visible:grid-rows-[1fr]">
                  <span className="overflow-hidden">{tile.description}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="bg-charcoal py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="How it works" title="Four steps to your new space" light />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <li
                key={step.title}
                data-reveal
                style={delay(i * 120)}
                className="group relative rounded-2xl border border-white/10 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brand/60 hover:bg-white/[0.04]"
              >
                <span className="block font-display text-6xl font-normal tracking-tight text-white/20 transition-all duration-500 group-hover:scale-110 group-hover:text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 leading-7 text-white/65">{step.description}</p>
                <span className="absolute inset-x-7 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Why choose us + stats/trophies ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionHeading eyebrow="Why Inside Mantra" title="Good design, without the surprises" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {whyChooseUs.map((item, i) => {
            const Icon = whyIcons[i % whyIcons.length];
            return (
              <div
                key={item.title}
                data-reveal
                style={delay(i * 90)}
                className="group rounded-3xl border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brand hover:shadow-xl hover:shadow-brand/15"
              >
                <span className="hexagon flex h-14 w-14 items-center justify-center bg-brand/15 text-accent transition-all duration-500 group-hover:rotate-[30deg] group-hover:bg-brand group-hover:text-charcoal">
                  <Icon size={24} strokeWidth={1.6} className="transition-transform duration-500 group-hover:-rotate-[30deg]" aria-hidden />
                </span>
                <h3 className="mt-5 font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>

        {(realStats.length > 0 || realTrophies.length > 0) && (
          <div className="mt-14 flex flex-wrap items-center gap-x-14 gap-y-6 border-t border-line pt-10" data-reveal>
            {realStats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-5xl font-normal tracking-tight">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
            {realTrophies.map((t) => (
              <div key={t.title} className="group flex items-center gap-3">
                <BadgeCheck size={30} strokeWidth={1.5} className="text-accent transition-transform duration-500 group-hover:scale-110" aria-hidden />
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-muted">{t.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Crafting ─────────────────────────────────────────────────────── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="How we build"
            title="Crafted with care, start to finish"
            intro="Every module goes through the same six stages before it reaches your home."
          />
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {craftingSteps.map((step, i) => (
              <div key={step.title} className="group" data-reveal style={delay((i % 3) * 120)}>
                <div className="relative overflow-hidden rounded-2xl">
                  <ImageSlot
                    slot={step.image}
                    alt={step.title}
                    className="aspect-[3/2]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    zoomOnHover
                    curtain
                    revealDelay={100 + (i % 3) * 120}
                  />
                  <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-charcoal backdrop-blur transition-colors duration-300 group-hover:bg-brand">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-normal transition-colors duration-300 group-hover:text-accent">{step.title}</h3>
                <p className="mt-1 leading-7 text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent work (only once projects have been added via the photo admin) ── */}
      {recentProjects.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="The works" title="Recent projects" />
            <Link href="/the-works/" data-reveal className="group inline-flex items-center gap-1.5 font-semibold text-accent">
              View all projects <ArrowRight size={18} className={arrowNudge} />
            </Link>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((p, i) => (
              <div key={p.slug} data-reveal style={delay(i * 120)}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Locations + CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10 lg:grid-cols-[1.3fr_1fr]" data-reveal="zoom">
          <div className="relative overflow-hidden bg-brand p-10 text-charcoal sm:p-14">
            <LogoMark className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 opacity-25 mix-blend-overlay" spin />
            <SplitWords
              text="Let’s talk about your space"
              reveal
              delayMs={250}
              className="relative font-display text-4xl leading-tight font-normal tracking-tight sm:text-5xl"
            />
            <p className="relative mt-4 max-w-md leading-7 text-charcoal/80">
              Book a free consultation. Tell us about your home, your plans and your budget, and we’ll show you what’s
              possible.
            </p>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link
                href={siteConfig.consultationHref}
                className="group inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {siteConfig.consultationCtaText} <ArrowRight size={18} className={arrowNudge} />
              </Link>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center rounded-full border border-charcoal/30 px-7 py-3.5 font-medium transition-all duration-300 hover:-translate-y-1 hover:border-charcoal hover:bg-white/30"
              >
                {contact.email}
              </a>
            </div>
          </div>
          <div className="space-y-2 bg-charcoal p-10 text-white sm:p-14">
            <p className="mb-4 text-xs font-display font-semibold uppercase tracking-[0.25em] text-brand">Our studios</p>
            {locations.map((loc) => (
              <a
                key={loc.city}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-3 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-white/5"
              >
                <MapPin size={20} className="shrink-0 text-brand transition-transform duration-300 group-hover:-translate-y-1" aria-hidden />
                <span className="flex-1">
                  <span className="block font-display text-2xl font-normal tracking-tight">{loc.city}</span>
                  {!isPlaceholder(loc.address) && <span className="block text-sm text-white/70">{loc.address}</span>}
                </span>
                <ArrowRight size={18} className="-translate-x-2 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </a>
            ))}
            <p className="pt-4 text-sm text-white/60">{contact.hours}</p>
          </div>
        </div>
      </section>
    </>
  );
}
