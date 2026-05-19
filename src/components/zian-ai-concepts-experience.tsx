"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ApproachSection } from "./sections/approach-section";
import { ContactSection } from "./sections/contact-section";
import { HeroSection } from "./sections/hero-section";
import { ProcessSection } from "./sections/process-section";
import { ServicesSection } from "./sections/services-section";
import { StatsSection } from "./sections/stats-section";

/** Static ambient-field state — a restrained technical backdrop behind the page. */
const ambientStyle: CSSProperties & Record<`--ambient-${string}`, string> = {
  "--ambient-core-x": "58%",
  "--ambient-core-y": "30%",
  "--ambient-rotate": "-6deg",
  "--ambient-scale-x": "1.04",
  "--ambient-scale-y": "1.1",
  "--ambient-skew": "0deg",
  "--ambient-warp-opacity": "0.32",
  "--ambient-warp-rotate": "-3deg",
  "--ambient-x": "0vw",
  "--ambient-y": "0vh",
};

export default function ZianAiConceptsExperience() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

      <SiteHeader />

      <div className="page-shell">
        <HeroSection reduced={prefersReducedMotion} />
        <ServicesSection />
        <ApproachSection reduced={prefersReducedMotion} />
        <StatsSection />
        <ProcessSection />
        <ContactSection />
        <SiteFooter />
      </div>
    </main>
  );
}
