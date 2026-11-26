"use client";

import { useEffect, useState } from "react";

/** Cross-fades between the hero images. Renders nothing if there are none. */
export function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        // Plain <img>: the site is a static export, so next/image can't optimise these anyway.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          fetchPriority={i === 0 ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
