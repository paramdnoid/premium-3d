"use client";

import { Environment, Line } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { buildJourney } from "@/lib/logo/choreography";
import { LOGO_SCALE } from "@/lib/logo/parts";
import { ResponsiveCamera } from "./responsive-camera";

type HeroSignetProps = {
  reduced?: boolean;
};

const HERO_SCALE = 1.28;
const HERO_LIFT = -0.08;
const DEPTH_SCALE = 0.7;

function detectWebGLSupport() {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true });

  return gl !== null;
}

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
      const alpha = Math.pow(core, 2.45);
      const index = (y * size + x) * 4;

      data[index] = 255;
      data[index + 1] = 237;
      data[index + 2] = 196;
      data[index + 3] = Math.round(alpha * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;

  return texture;
}

function AmbientGlow() {
  const glowTexture = useMemo(() => createGlowTexture(), []);

  return (
    <group position={[0.12, 0.02, -1.25]}>
      <mesh scale={[4.3, 4.3, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.54}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.62, 0.24, 0.02]} scale={[1.45, 1.45, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function StaticLogoFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="-140 -140 280 280"
        className="h-[72%] max-h-[430px] w-[72%] max-w-[430px] opacity-95 drop-shadow-[0_0_42px_rgba(244,215,161,0.28)]"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="fallbackShell" x1="-92" y1="-104" x2="98" y2="112" gradientUnits="userSpaceOnUse">
            <stop stopColor="#151815" />
            <stop offset="0.48" stopColor="#040504" />
            <stop offset="1" stopColor="#252a22" />
          </linearGradient>
          <linearGradient id="fallbackRim" x1="-82" y1="-92" x2="88" y2="96" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fff0" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#f4d7a1" stopOpacity="0.28" />
            <stop offset="1" stopColor="#f8fff0" stopOpacity="0.72" />
          </linearGradient>
          <filter id="fallbackGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M0-110 82-62 82 58 0 110-82 58-82-62Z"
          fill="url(#fallbackShell)"
          stroke="url(#fallbackRim)"
          strokeWidth="3"
        />
        <path
          d="M0-78 57-44 57 41 0 78-57 41-57-44Z"
          fill="none"
          stroke="#f8fff0"
          strokeOpacity="0.28"
          strokeWidth="2"
        />
        <path
          d="M-52-45H55V-18L-9 20H55V48H-55V20L9-18H-52Z"
          fill="#f8fff0"
          filter="url(#fallbackGlow)"
        />
        <path
          d="M-82-62 0 0 82-62M-82 58 0 0 82 58"
          fill="none"
          stroke="#f4d7a1"
          strokeOpacity="0.18"
          strokeWidth="1.3"
        />
      </svg>
    </div>
  );
}

function AssembledSignet() {
  const journey = useMemo(() => buildJourney(), []);

  return (
    <group position={[0, HERO_LIFT, 0]} rotation={[-0.1, -0.46, 0.04]}>
      <group
        scale={[
          LOGO_SCALE * HERO_SCALE,
          LOGO_SCALE * HERO_SCALE,
          LOGO_SCALE * HERO_SCALE * DEPTH_SCALE,
        ]}
      >
        {journey.parts.map((part) => (
          <group
            key={part.id}
            position={[part.pivot.x, part.pivot.y, part.pivot.z]}
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

export function HeroSignet({}: HeroSignetProps) {
  const [webglSupported, setWebglSupported] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWebglSupported(detectWebGLSupport());
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none relative h-full min-h-[inherit] w-full" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_47%,rgba(244,215,161,0.11),transparent_35%),radial-gradient(ellipse_at_62%_58%,rgba(248,251,255,0.055),transparent_44%)]" />
      {webglSupported ? (
        <Canvas
          orthographic
          dpr={[1, 2]}
          camera={{ position: [0, 0, 7], zoom: 112, near: 0.1, far: 100 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.22;
          }}
        >
          <ResponsiveCamera />
          <ambientLight intensity={0.25} />
          <directionalLight position={[-3.4, 3.5, 5.4]} intensity={1.42} color="#fff8ea" />
          <directionalLight position={[3.7, -1.3, 3.8]} intensity={0.34} color="#dbe4d8" />
          <directionalLight position={[1.1, 2.8, -4.8]} intensity={1.08} color="#e6f1dc" />
          <spotLight
            position={[-1.55, 1.9, 3.25]}
            angle={0.24}
            penumbra={0.64}
            intensity={28}
            color="#fffdf3"
            distance={6}
            decay={2.1}
          />
          <spotLight
            position={[1.7, 0.42, 2.8]}
            angle={0.18}
            penumbra={0.72}
            intensity={15}
            color="#f4d7a1"
            distance={5}
            decay={2.2}
          />
          <pointLight position={[-1.9, -1.15, 2.25]} intensity={2.1} color="#ffffff" distance={4.2} decay={2} />
          <pointLight position={[2.1, 0.8, -3.4]} intensity={4.6} color="#f4d7a1" distance={4.8} decay={2.1} />
          <pointLight position={[0.15, -0.26, 1.25]} intensity={5.4} color="#fff5c8" distance={2.9} decay={2.4} />
          <Environment preset="city" environmentIntensity={0.28} />
          <AmbientGlow />
          <AssembledSignet />
        </Canvas>
      ) : (
        <StaticLogoFallback />
      )}
    </div>
  );
}
