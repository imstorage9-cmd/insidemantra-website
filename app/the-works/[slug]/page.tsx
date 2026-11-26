import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { getProject, getProjects } from "@/lib/projects";
import { siteConfig } from "@/config/site";
import { delay } from "@/lib/motion";

// Static export: one page per project folder, generated at build time. Unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  const projects = getProjects();
  // Next's static export needs at least one path for a dynamic route; this placeholder renders a 404.
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "_none" }];
}

export async function generateMetadata({ params }: PageProps<"/the-works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description || `${project.title}${project.location ? `, ${project.location}` : ""} by ${siteConfig.name}.`,
  };
}

export default async function ProjectPage({ params }: PageProps<"/the-works/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <Link href="/the-works/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> All projects
      </Link>

      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-5xl leading-tight font-normal tracking-tight sm:text-6xl">{project.title}</h1>
        {project.location && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-muted">
            <MapPin size={16} aria-hidden /> {project.location}
          </p>
        )}
        {project.description && <p className="mt-5 text-lg leading-8 text-muted">{project.description}</p>}
      </header>

      {project.rooms.length > 1 && (
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Rooms">
          {project.rooms.map((room) => (
            <a
              key={room.id}
              href={`#${room.id}`}
              className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
            >
              {room.label} <span className="text-muted">({room.photos.length})</span>
            </a>
          ))}
        </nav>
      )}

      {project.rooms.map((room) => (
        <section key={room.id} id={room.id} className="mt-14 scroll-mt-24">
          <h2 className="border-b border-line pb-3 font-display text-3xl font-normal tracking-tight">{room.label}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {room.photos.map((src, i) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                style={delay((i % 2) * 100)}
                className={`group relative block overflow-hidden rounded-xl bg-surface shadow-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/15 ${
                  room.photos.length % 2 === 1 && i === 0 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${room.label}, ${project.title}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-20 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-surface p-8 sm:p-10">
        <p className="font-display text-3xl font-normal tracking-tight">Want something like this for your home?</p>
        <Link
          href={siteConfig.consultationHref}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30"
        >
          {siteConfig.consultationCtaText} <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
}
