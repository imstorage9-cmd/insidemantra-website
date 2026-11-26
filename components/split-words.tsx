import type { CSSProperties, ElementType } from "react";

/**
 * Splits a heading into words, each inside a mask, so the words can rise into place one after another.
 * - In page sections: pass `reveal` → plays when scrolled into view.
 * - In the hero: pass `onLoad` → plays as soon as the page loads.
 * Screen readers get the plain text via aria-label.
 */
export function SplitWords({
  text,
  as: Tag = "h2",
  className = "",
  reveal = false,
  onLoad = false,
  delayMs = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  reveal?: boolean;
  onLoad?: boolean;
  delayMs?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag
      aria-label={text}
      data-reveal={reveal ? "words" : undefined}
      className={`${onLoad ? "animate-words" : ""} ${className}`}
      style={{ "--delay": `${delayMs}ms` } as CSSProperties}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="split-word">
          <span style={{ "--i": i } as CSSProperties}>{w}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
