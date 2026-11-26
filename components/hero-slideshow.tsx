"use client";

import { useEffect, useState } from "react";

/** Cross-fades between the hero images with a slow "Ken Burns" zoom. Renders nothing if there are none. */
export function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 7000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="hero-parallax absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          {/* Plain <img>: the site is a static export, so next/image can't optimise these anyway. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            // Re-keying on index restarts the zoom each time this slide comes back.
            key={i === index ? `on-${index}` : "off"}
            src={src}
            alt=""
            fetchPriority={i === 0 ? "high" : "auto"}
            className={`h-full w-full object-cover ${i === index ? "animate-kenburns" : ""}`}
          />
        </div>
      ))}
    </div>
  );
}
