import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "The Works",
  description: "Homes and spaces designed and delivered by Inside Mantra.",
};

export default function TheWorksPage() {
  const projects = getProjects();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">The works</p>
      <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">Our projects</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        A look inside homes we’ve designed and delivered, room by room.
      </p>

      {projects.length > 0 ? (
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-line p-12 text-center text-muted">
          <p>New projects are on their way.</p>
          <Link href={siteConfig.consultationHref} className="mt-3 inline-block font-medium text-accent">
            {siteConfig.consultationCtaText}
          </Link>
        </div>
      )}
    </section>
  );
}
