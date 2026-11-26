import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/the-works/${project.slug}/`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface shadow-sm transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-black/15">
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 text-sm font-semibold tracking-[0.2em] text-white uppercase opacity-0 transition-all duration-500 group-hover:bg-black/35 group-hover:opacity-100">
          View project
        </span>
        {project.cover && (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
      </div>
      <h3 className="mt-5 flex items-center gap-2 font-display text-2xl font-normal transition-colors duration-300 group-hover:text-accent">
        {project.title}
        <ArrowRight size={18} className="text-accent transition-transform duration-300 group-hover:translate-x-1.5" />
      </h3>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted">
        {project.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} aria-hidden /> {project.location}
          </span>
        )}
        <span>{project.rooms.map((r) => r.label).join(" · ")}</span>
      </p>
    </Link>
  );
}
