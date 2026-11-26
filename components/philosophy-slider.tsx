"use client";

import { useEffect, useState } from "react";

type Quote = { label: string; text: string };

/** Auto-rotating quotes with clickable dots (pauses while hovered). */
export function PhilosophySlider({ quotes, interval = 5500 }: { quotes: Quote[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || quotes.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % quotes.length), interval);
    return () => clearInterval(id);
  }, [paused, quotes.length, interval]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="text-center">
      {/* All quotes share one grid cell, so the box is as tall as the longest quote and nothing jumps. */}
      <div className="grid" aria-live="polite">
        {quotes.map((q, i) => (
          <figure
            key={q.label}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 transition-all duration-700 ease-out ${
              i === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <p className="text-sm font-display font-semibold tracking-[0.25em] text-accent uppercase">{q.label}</p>
            <blockquote className="mx-auto mt-6 max-w-3xl font-display text-3xl leading-snug font-normal tracking-tight sm:text-5xl sm:leading-tight">
              “{q.text}”
            </blockquote>
          </figure>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-3">
        {quotes.map((q, i) => (
          <button
            key={q.label}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show “${q.label}”`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i === index ? "w-10 bg-brand" : "w-2.5 bg-line hover:bg-brand/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
