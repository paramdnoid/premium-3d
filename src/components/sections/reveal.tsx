"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

let pluginRegistered = false;

/**
 * Reveals its children with a scroll-driven clip-path wipe — the content is
 * geometrically un-clipped (top-down) as it scrolls into view, never faded.
 * Under reduced motion the content is shown immediately.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.clipPath = "none";
      element.style.transform = "none";
      return;
    }

    if (!pluginRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      pluginRegistered = true;
    }

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 92%",
      end: "top 44%",
      scrub: 0.6,
      onUpdate: (self) => {
        const hidden = 1 - self.progress;
        element.style.clipPath = `inset(0px 0px ${(hidden * 100).toFixed(2)}% 0px)`;
        element.style.transform = `translate3d(0px, ${(hidden * 42).toFixed(2)}px, 0px)`;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
