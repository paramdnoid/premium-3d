"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useScrollRig } from "@/lib/scroll/use-scroll-rig";
import { JourneyLogo } from "./scene/journey-logo";
import { ApproachSection } from "./sections/approach-section";
import { ContactSection } from "./sections/contact-section";
import { HeroSection } from "./sections/hero-section";
import { ProcessSection } from "./sections/process-section";
import { ServicesSection } from "./sections/services-section";
import { StatsSection } from "./sections/stats-section";

/** Static ambient-field state — a calm, moody backdrop behind the page. */
const ambientStyle: CSSProperties & Record<`--ambient-${string}`, string> = {
  "--ambient-core-x": "42%",
  "--ambient-core-y": "38%",
  "--ambient-rotate": "-8deg",
  "--ambient-scale-x": "1.08",
  "--ambient-scale-y": "1.16",
  "--ambient-skew": "0deg",
  "--ambient-warp-opacity": "0.4",
  "--ambient-warp-rotate": "0deg",
  "--ambient-x": "0vw",
  "--ambient-y": "0vh",
};

export default function ZianAiConceptsExperience() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollState = useScrollRig();

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  return (
    <main
      className={[
        "premium-experience relative min-h-screen overflow-x-hidden bg-[#010202] text-[#f8fbff]",
        prefersReducedMotion ? "is-reduced-motion" : "",
      ].join(" ")}
    >
      <div
        className="ambient-field pointer-events-none fixed inset-0 z-0"
        style={ambientStyle}
        aria-hidden="true"
      >
        <div className="ambient-field__depth" />
        <div className="ambient-field__warp" />
        <div className="ambient-field__grain" />
      </div>

      {/* The disassembling signet — fixed behind the content, never blocks input. */}
      <div
        className="journey-canvas pointer-events-none fixed inset-0 z-[2]"
        aria-hidden="true"
      >
        <JourneyLogo scrollRef={scrollState} />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <ApproachSection />
        <StatsSection />
        <ProcessSection />
        <ContactSection />
      </div>
    </main>
  );
}
