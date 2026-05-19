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

/** Places the signet behind the hero wordmark instead of above it. */
const LOGO_LIFT = -0.45;
const BACKDROP_LOGO_SCALE = 1.34;
const ASSEMBLED_DEPTH_SCALE = 0.52;
const IDLE_ROTATION_SPEED = 0.16;

function createGlowTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  const center = (size - 1) / 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x - center) / center;
      const dy = (y - center) / center;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const core = Math.max(0, 1 - radius);
      const alpha = Math.pow(core, 2.35);
      const index = (y * size + x) * 4;
      data[index] = 255;
      data[index + 1] = 244;
      data[index + 2] = 205;
      data[index + 3] = Math.round(alpha * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

function CinematicGlow() {
  const glowTexture = useMemo(() => createGlowTexture(), []);

  return (
    <group position={[0, LOGO_LIFT + 0.15, -1.1]}>
      <mesh scale={[3.9, 3.9, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.42, 0.16, 0.01]} scale={[1.45, 1.45, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.58}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** The signet, spinning and shedding its parts as the page scrolls. */
function DisassemblingLogo() {
  const scroll = useScrollState();
  const journey = useMemo(() => buildJourney(), []);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const liftRef = useRef<THREE.Group>(null);
  const depthRef = useRef<THREE.Group>(null);

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
      liftRef.current.rotation.y = idle * elapsed * IDLE_ROTATION_SPEED;
      liftRef.current.position.y =
        LOGO_LIFT + rise + idle * Math.sin(elapsed * 0.6) * 0.05;
    }

    if (depthRef.current) {
      const release = reduced ? 0 : Math.min(1, Math.max(0, (p - 0.04) / 0.16));
      const easedRelease = release * release * (3 - 2 * release);
      const depthScale =
        ASSEMBLED_DEPTH_SCALE + easedRelease * (1 - ASSEMBLED_DEPTH_SCALE);
      depthRef.current.scale.set(
        LOGO_SCALE * BACKDROP_LOGO_SCALE,
        LOGO_SCALE * BACKDROP_LOGO_SCALE,
        LOGO_SCALE * BACKDROP_LOGO_SCALE * depthScale,
      );
    }
  });

  return (
    <group ref={liftRef} position={[0, LOGO_LIFT, 0]}>
      <group
        ref={depthRef}
        scale={[
          LOGO_SCALE * BACKDROP_LOGO_SCALE,
          LOGO_SCALE * BACKDROP_LOGO_SCALE,
          LOGO_SCALE * BACKDROP_LOGO_SCALE * ASSEMBLED_DEPTH_SCALE,
        ]}
      >
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
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.28;
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <ScrollContext.Provider value={scrollRef}>
        <ResponsiveCamera />
        <ambientLight intensity={0.26} />
        <directionalLight position={[-3.4, 3.4, 5.2]} intensity={1.38} color="#fff8ea" />
        <directionalLight position={[3.6, -1.4, 3.8]} intensity={0.34} color="#dbe4d8" />
        <directionalLight position={[1.2, 2.8, -4.8]} intensity={1.18} color="#e6f1dc" />
        <spotLight
          position={[-1.55, 1.9, 3.25]}
          angle={0.24}
          penumbra={0.64}
          intensity={32}
          color="#fffdf3"
          distance={6}
          decay={2.1}
        />
        <spotLight
          position={[1.6, 0.42, 2.8]}
          angle={0.18}
          penumbra={0.72}
          intensity={17}
          color="#f4d7a1"
          distance={5}
          decay={2.2}
        />
        <pointLight position={[-1.9, -1.15, 2.25]} intensity={2.2} color="#ffffff" distance={4.2} decay={2} />
        <pointLight position={[2.1, 0.8, -3.4]} intensity={4.8} color="#f4d7a1" distance={4.8} decay={2.1} />
        <pointLight position={[0.15, -0.26, 1.25]} intensity={5.8} color="#fff5c8" distance={2.9} decay={2.4} />
        <Environment preset="city" environmentIntensity={0.28} />
        <CinematicGlow />
        <DisassemblingLogo />
      </ScrollContext.Provider>
    </Canvas>
  );
}
