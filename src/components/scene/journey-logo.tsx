"use client";

import { Environment, Line } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { applyPose, buildJourney } from "@/lib/logo/choreography";
import { LOGO_SCALE } from "@/lib/logo/parts";
import { ScrollContext, useScrollState } from "@/lib/scroll/scroll-context";
import type { ScrollState } from "@/lib/scroll/scroll-context";
import { ResponsiveCamera } from "./responsive-camera";

/** Lifts the signet into the upper part of the viewport (the hero region). */
const LOGO_LIFT = 1.9;

/** The signet, spinning and shedding its parts as the page scrolls. */
function DisassemblingLogo() {
  const scroll = useScrollState();
  const journey = useMemo(() => buildJourney(), []);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const liftRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const { progress, reduced } = scroll.current;
    const p = reduced ? 0 : progress;

    for (let index = 0; index < journey.parts.length; index += 1) {
      const group = partRefs.current[index];
      if (group) {
        applyPose(journey.parts[index], p, group);
      }
    }

    // Idle while assembled; then the signet ascends and clears the page as
    // it comes apart, so the debris never lingers over the section content.
    if (liftRef.current) {
      const idle = reduced ? 0 : Math.max(0, 1 - p / 0.06);
      const rise = reduced ? 0 : Math.min(1, Math.max(0, (p - 0.04) / 0.22)) * 6;
      const elapsed = state.clock.elapsedTime;
      liftRef.current.rotation.y = idle * Math.sin(elapsed * 0.4) * 0.14;
      liftRef.current.position.y =
        LOGO_LIFT + rise + idle * Math.sin(elapsed * 0.6) * 0.05;
    }
  });

  return (
    <group ref={liftRef} position={[0, LOGO_LIFT, 0]}>
      <group scale={LOGO_SCALE}>
        {journey.parts.map((part, index) => (
          <group
            key={part.id}
            ref={(element) => {
              partRefs.current[index] = element;
            }}
          >
            {part.kind === "mesh" ? (
              <mesh
                geometry={part.geometry}
                material={part.material}
                position={part.meshOffset}
                scale={part.homeScale}
              />
            ) : (
              part.lines.map((line, lineIndex) => (
                <Line
                  key={lineIndex}
                  points={line.points}
                  color={line.color}
                  lineWidth={line.lineWidth}
                  transparent
                  opacity={line.opacity}
                  dashed={line.dashed}
                  dashSize={line.dashSize}
                  gapSize={line.gapSize}
                />
              ))
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

/** Fixed full-viewport canvas hosting the scroll-driven signet. */
export function JourneyLogo({ scrollRef }: { scrollRef: RefObject<ScrollState> }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 7], zoom: 120, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <ScrollContext.Provider value={scrollRef}>
        <ResponsiveCamera />
        <ambientLight intensity={0.34} />
        <directionalLight position={[-2.6, 2.9, 4.8]} intensity={0.86} color="#f7f7ef" />
        <directionalLight position={[2.7, -1.2, 3.4]} intensity={0.34} color="#d7d9d0" />
        <directionalLight position={[0.8, 2.1, -4.2]} intensity={0.52} color="#dce7d8" />
        <pointLight position={[0.2, 1.8, 2.6]} intensity={3.4} color="#eef2e7" distance={5.6} decay={2.2} />
        <pointLight position={[-1.6, -1.1, 2.4]} intensity={1.7} color="#ffffff" distance={4.2} decay={2} />
        <pointLight position={[1.8, 0.6, -3.2]} intensity={2.2} color="#f4d7a1" distance={4.8} decay={2.1} />
        <Environment preset="city" environmentIntensity={0.12} />
        <DisassemblingLogo />
      </ScrollContext.Provider>
    </Canvas>
  );
}
