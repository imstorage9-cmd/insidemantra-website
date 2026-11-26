/** The Inside Mantra hexagon mark (amber hexagon with two interlocking squares), as crisp SVG. */
export function LogoMark({ className = "", spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points="50,2 91.6,26 91.6,74 50,98 8.4,74 8.4,26" fill="#FAA831" />
      <g fill="none" stroke="#fff" strokeWidth="1.6" className={spin ? "origin-center animate-spin-slow" : undefined}>
        <rect x="30" y="30" width="40" height="40" />
        <rect x="32" y="32" width="36" height="36" />
        <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" />
        <rect x="32" y="32" width="36" height="36" transform="rotate(45 50 50)" />
      </g>
    </svg>
  );
}
