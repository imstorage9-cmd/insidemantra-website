"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Animates every [data-reveal] element into view as it scrolls onto the screen.
 * Mounted once in the root layout; re-scans after each page navigation.
 * Optional stagger: style={{ "--delay": "120ms" }} on the element.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => observer.observe(el));
    scan();

    // Pick up elements that render later (e.g. client components).
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
