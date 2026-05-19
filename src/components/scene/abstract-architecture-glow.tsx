"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildArchitectureElement } from "@/lib/architecture/choreography";
import { ARCHITECTURE_VIEW } from "@/lib/architecture/geometry";

type AbstractArchitectureGlowProps = {
  reduced?: boolean;
  className?: string;
};

const SVG_SRC = "/assets/abstract-architecture-glow.svg";

function detectWebGLSupport() {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true });

  return gl !== null;
}

/** Scales the authored SVG space to the canvas like CSS object-cover. */
function CoverGroup({ children }: { children: ReactNode }) {
  const size = useThree((state) => state.size);
  const scale = Math.max(
    size.width / ARCHITECTURE_VIEW.width,
    size.height / ARCHITECTURE_VIEW.height,
  );

  return <group scale={[scale, scale, scale]}>{children}</group>;
}

function ArchitectureAssembly({ reduced }: { reduced: boolean }) {
  const sourceTexture = useLoader(THREE.TextureLoader, SVG_SRC);
  const element = useMemo(
    () => buildArchitectureElement(sourceTexture),
    [sourceTexture],
  );
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    groupRef.current.position.x = reduced ? 0 : Math.sin(t * 0.12) * 4;
    groupRef.current.position.y = reduced ? 0 : Math.cos(t * 0.16) * 2.5;
  });

  return (
    <group ref={groupRef}>
      {element.parts.map((part) => (
        <group
          key={part.id}
          position={[part.pivot.x, part.pivot.y, part.pivot.z]}
          rotation={part.homeRotation}
        >
          <mesh
            geometry={part.geometry}
            material={part.material}
            position={part.meshOffset}
            scale={part.homeScale}
          />
        </group>
      ))}
    </group>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  return (
    <CoverGroup>
      <ambientLight intensity={0.34} />
      <directionalLight position={[-3.5, 3.8, 6]} intensity={1.15} color="#fff8ea" />
      <directionalLight position={[3.8, -1.6, 4.4]} intensity={0.5} color="#dbe4d8" />
      <pointLight position={[420, -90, 130]} intensity={42} color="#f4d7a1" distance={900} decay={2} />
      <ArchitectureAssembly reduced={reduced} />
    </CoverGroup>
  );
}

export function AbstractArchitectureGlow({
  reduced = false,
  className,
}: AbstractArchitectureGlowProps) {
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
    <div
      className={`pointer-events-none relative h-full w-full overflow-hidden bg-[#070707] ${
        className ?? ""
      }`}
      aria-hidden="true"
    >
      {webglSupported ? (
        <Canvas
          orthographic
          dpr={[1, 2]}
          camera={{ position: [0, 0, 1000], zoom: 1, near: 0.1, far: 2000 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1;
          }}
        >
          <Scene reduced={reduced} />
        </Canvas>
      ) : (
        <Image
          src={SVG_SRC}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}
    </div>
  );
}
