import type { CSSProperties } from "react";

/** Stagger helper for scroll-reveal / fade-up animations: style={delay(120)} */
export const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
