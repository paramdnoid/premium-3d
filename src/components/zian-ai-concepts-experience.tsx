"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import ZianLogo3D from "./zian-logo-3d";

type AmbientStyle = CSSProperties & {
  "--ambient-core-x": string;
  "--ambient-core-y": string;
  "--ambient-rotate": string;
  "--ambient-scale-x": string;
  "--ambient-scale-y": string;
  "--ambient-skew": string;
  "--ambient-warp-opacity": string;
  "--ambient-warp-rotate": string;
  "--ambient-x": string;
  "--ambient-y": string;
};

const initialAmbientStyle: AmbientStyle = {
  "--ambient-core-x": "42%",
  "--ambient-core-y": "38%",
  "--ambient-rotate": "-8deg",
  "--ambient-scale-x": "1.08",
  "--ambient-scale-y": "1.16",
  "--ambient-skew": "0deg",
  "--ambient-warp-opacity": "0.44",
  "--ambient-warp-rotate": "0deg",
  "--ambient-x": "0vw",
  "--ambient-y": "0vh",
};

export default function ZianAiConceptsExperience() {
  const progressFrame = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [logoRotationProgress, setLogoRotationProgress] = useState(0);
  const [ambientStyle, setAmbientStyle] = useState<AmbientStyle>(initialAmbientStyle);

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

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      const wave = Math.sin(scrollProgress * Math.PI * 2.1);
      const bend = Math.cos(scrollProgress * Math.PI * 1.35);

      setLogoRotationProgress(scrollProgress);
      setAmbientStyle({
        "--ambient-core-x": `${(40 + scrollProgress * 26).toFixed(2)}%`,
        "--ambient-core-y": `${(34 + Math.sin(scrollProgress * Math.PI) * 22).toFixed(2)}%`,
        "--ambient-rotate": `${(-9 + scrollProgress * 24).toFixed(2)}deg`,
        "--ambient-scale-x": `${(1.08 + scrollProgress * 0.22).toFixed(3)}`,
        "--ambient-scale-y": `${(1.18 - scrollProgress * 0.11).toFixed(3)}`,
        "--ambient-skew": `${(wave * 7).toFixed(2)}deg`,
        "--ambient-warp-opacity": `${(0.36 + scrollProgress * 0.28).toFixed(3)}`,
        "--ambient-warp-rotate": `${(scrollProgress * 42 + bend * 8).toFixed(2)}deg`,
        "--ambient-x": `${((scrollProgress - 0.5) * 16).toFixed(2)}vw`,
        "--ambient-y": `${(wave * 7).toFixed(2)}vh`,
      });
    };

    const requestUpdate = () => {
      if (progressFrame.current !== null) {
        return;
      }

      progressFrame.current = window.requestAnimationFrame(() => {
        progressFrame.current = null;
        updateScrollState();
      });
    };

    updateScrollState();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (progressFrame.current !== null) {
        window.cancelAnimationFrame(progressFrame.current);
      }
    };
  }, []);

  return (
    <main
      className={[
        "premium-experience relative min-h-screen overflow-x-hidden bg-[#010202] text-[#f8fbff]",
        prefersReducedMotion ? "is-reduced-motion" : "",
      ].join(" ")}
    >
      <h1 className="sr-only">ZIAN AI CONCEPTS</h1>

      <div
        className="ambient-field pointer-events-none fixed inset-0 z-0"
        style={ambientStyle}
        aria-hidden="true"
      >
        <div className="ambient-field__depth" />
        <div className="ambient-field__warp" />
        <div className="ambient-field__grain" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-20 grid place-items-center px-6"
        aria-hidden="true"
      >
        <ZianLogo3D
          rotationProgress={logoRotationProgress}
          rotationEnabled={!prefersReducedMotion}
        />
      </div>

      <div className="relative z-10" aria-hidden="true">
        <div
          className="scroll-timeline h-[500svh] w-screen"
          data-scroll-timeline
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
