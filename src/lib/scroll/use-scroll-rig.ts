"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { ScrollState } from "./scroll-context";

let pluginRegistered = false;

/**
 * Sets up Lenis smooth-scroll plus a single scrubbed ScrollTrigger spanning the
 * whole page. The page progress (0..1) is written into a ref the R3F loop reads
 * each frame — no React re-renders. `gsap.ticker` is the single clock.
 *
 * Under reduced motion no smooth-scroll or scrub is created; `progress` stays
 * at 0 so the logo simply rests assembled in the hero.
 */
export function useScrollRig(): RefObject<ScrollState> {
  const state = useRef<ScrollState>({ progress: 0, reduced: false });

  useEffect(() => {
    if (!pluginRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      pluginRegistered = true;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    state.current.reduced = reduced;
    if (reduced) {
      state.current.progress = 0;
      return;
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (process.env.NODE_ENV !== "production") {
      (window as typeof window & { __lenis?: Lenis }).__lenis = lenis;
    }

    const pageTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,
      onUpdate: (self) => {
        state.current.progress = self.progress;
      },
    });

    return () => {
      pageTrigger.kill();
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return state;
}
