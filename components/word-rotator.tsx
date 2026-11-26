"use client";

import { useEffect, useState } from "react";

/** Cycles through words with a slide-up animation, e.g. "Be Different → Be Creative → …". */
export function WordRotator({ words, interval = 2200, className = "" }: { words: string[]; interval?: number; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      {/* Invisible copies of every word reserve the width of the longest one */}
      {words.map((w) => (
        <span key={`size-${w}`} className="invisible col-start-1 row-start-1" aria-hidden>
          {w}
        </span>
      ))}
      {words.map((w, i) => (
        <span
          key={w}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 transition-all duration-500 ease-out ${
            i === index ? "translate-y-0 opacity-100" : i === (index - 1 + words.length) % words.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
          }`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
