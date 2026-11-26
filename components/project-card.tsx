import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/the-works/${project.slug}/`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
        {project.cover && (
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <h3 className="mt-4 flex items-center gap-2 font-display text-2xl font-semibold">
        {project.title}
        <ArrowRight size={18} className="text-accent transition-transform group-hover:translate-x-1" />
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
