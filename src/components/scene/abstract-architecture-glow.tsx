"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type AbstractArchitectureGlowProps = {
  reduced?: boolean;
  className?: string;
};

/** Source SVG viewBox — the scene is authored in these pixel coordinates. */
const VIEW_W = 1672;
const VIEW_H = 864;
const FALLBACK_SRC = "/assets/abstract-architecture-glow.svg";

/** Map an SVG-space point (origin top-left, y-down) to centred, y-up world space. */
function vec(x: number, y: number, z = 0) {
  return new THREE.Vector3(x - VIEW_W / 2, VIEW_H / 2 - y, z);
}

function detectWebGLSupport() {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true });

  return gl !== null;
}

/* ------------------------------------------------------------------ */
/* Texture factories                                                   */
/* ------------------------------------------------------------------ */

type GradientStop = { offset: number; color: string };

/** Bakes a multi-stop linear gradient (angle in degrees, canvas y-down space). */
function makeLinearGradientTexture(stops: GradientStop[], angleDeg = 90) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const a = (angleDeg * Math.PI) / 180;
  const hx = (Math.cos(a) * size) / 2;
  const hy = (Math.sin(a) * size) / 2;
  const grad = ctx.createLinearGradient(
    size / 2 - hx,
    size / 2 - hy,
    size / 2 + hx,
    size / 2 + hy,
  );
  for (const stop of stops) grad.addColorStop(stop.offset, stop.color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Bakes a centred radial gradient — used for the warm panel bloom. */
function makeRadialGradientTexture(stops: GradientStop[]) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  for (const stop of stops) grad.addColorStop(stop.offset, stop.color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Soft circular falloff (white, tintable) for glow nodes. */
function createGlowTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  const center = (size - 1) / 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x - center) / center;
      const dy = (y - center) / center;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const alpha = Math.pow(Math.max(0, 1 - radius), 2.6);
      const index = (y * size + x) * 4;

      data[index] = 255;
      data[index + 1] = 255;
      data[index + 2] = 255;
      data[index + 3] = Math.round(alpha * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

/** Small soft dot sprite for the technical dot matrices. */
function createDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.55, "rgba(255,255,255,0.85)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/** Warm beam gradient: warm-to-white along its length, soft falloff across it. */
function createBeamTexture() {
  const w = 512;
  const h = 96;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const lengthGrad = ctx.createLinearGradient(0, 0, w, 0);
  lengthGrad.addColorStop(0, "rgba(34,35,38,0)");
  lengthGrad.addColorStop(0.16, "rgba(143,139,130,0.34)");
  lengthGrad.addColorStop(0.46, "rgba(255,228,173,0.92)");
  lengthGrad.addColorStop(0.68, "rgba(255,245,214,1)");
  lengthGrad.addColorStop(0.82, "rgba(255,197,109,0.74)");
  lengthGrad.addColorStop(1, "rgba(247,180,89,0.05)");
  ctx.fillStyle = lengthGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "destination-in";
  const crossGrad = ctx.createLinearGradient(0, 0, 0, h);
  crossGrad.addColorStop(0, "rgba(0,0,0,0)");
  crossGrad.addColorStop(0.5, "rgba(0,0,0,1)");
  crossGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = crossGrad;
  ctx.fillRect(0, 0, w, h);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Single-cell grid sprite, tiled to recreate the micro-grid overlay. */
function createGridTexture() {
  const cell = 24;
  const canvas = document.createElement("canvas");
  canvas.width = cell;
  canvas.height = cell;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "rgba(215,208,196,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0.5, 0);
  ctx.lineTo(0.5, cell);
  ctx.moveTo(0, 0.5);
  ctx.lineTo(cell, 0.5);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/* ------------------------------------------------------------------ */
/* Scene layers                                                        */
/* ------------------------------------------------------------------ */

/** Scales the design (1672×864) to fully cover the canvas — like CSS object-cover. */
function CoverGroup({ children }: { children: ReactNode }) {
  const size = useThree((state) => state.size);
  const scale = Math.max(size.width / VIEW_W, size.height / VIEW_H);

  return <group scale={[scale, scale, 1]}>{children}</group>;
}

function Background() {
  const field = useMemo(
    () =>
      makeLinearGradientTexture(
        [
          { offset: 0, color: "#070707" },
          { offset: 0.48, color: "#090a0b" },
          { offset: 1, color: "#040405" },
        ],
        45,
      ),
    [],
  );
  const bloom = useMemo(
    () =>
      makeRadialGradientTexture([
        { offset: 0, color: "rgba(242,239,229,0.42)" },
        { offset: 0.24, color: "rgba(185,183,176,0.16)" },
        { offset: 0.64, color: "rgba(20,21,23,0.06)" },
        { offset: 1, color: "rgba(5,5,6,0)" },
      ]),
    [],
  );

  return (
    <group>
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[VIEW_W, VIEW_H]} />
        <meshBasicMaterial map={field} />
      </mesh>
      <mesh position={vec(1252, 269, -16)} scale={[840, 480, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={bloom}
          transparent
          opacity={0.62}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

type PanelSpec = {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  opacity: number;
  angle: number;
  stops: GradientStop[];
};

/** The three glass panels, back-to-front. */
const PANELS: PanelSpec[] = [
  {
    x: 1011,
    y: 305,
    w: 303,
    h: 462,
    z: -9,
    opacity: 0.36,
    angle: 29,
    stops: [
      { offset: 0, color: "#111315" },
      { offset: 0.38, color: "#0b0c0d" },
      { offset: 1, color: "#050506" },
    ],
  },
  {
    x: 1218,
    y: 343,
    w: 364,
    h: 425,
    z: -7,
    opacity: 0.62,
    angle: 62,
    stops: [
      { offset: 0, color: "#151719" },
      { offset: 0.3, color: "#222427" },
      { offset: 0.72, color: "#0d0e10" },
      { offset: 1, color: "#050506" },
    ],
  },
  {
    x: 1206,
    y: 58,
    w: 394,
    h: 285,
    z: -5,
    opacity: 0.9,
    angle: 33,
    stops: [
      { offset: 0, color: "#1a1b1c" },
      { offset: 0.25, color: "#212326" },
      { offset: 0.58, color: "#111214" },
      { offset: 1, color: "#050506" },
    ],
  },
];

function Panels() {
  const textures = useMemo(
    () => PANELS.map((panel) => makeLinearGradientTexture(panel.stops, panel.angle)),
    [],
  );

  return (
    <>
      {PANELS.map((panel, index) => (
        <mesh
          key={panel.z}
          position={vec(panel.x + panel.w / 2, panel.y + panel.h / 2, panel.z)}
        >
          <planeGeometry args={[panel.w, panel.h]} />
          <meshBasicMaterial
            map={textures[index]}
            transparent
            opacity={panel.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function MicroGrid() {
  const texture = useMemo(() => {
    const grid = createGridTexture();
    grid.repeat.set(573 / 24, 462 / 24);
    return grid;
  }, []);

  return (
    <mesh position={vec(1011 + 573 / 2, 305 + 462 / 2, -3)}>
      <planeGeometry args={[573, 462]} />
      <meshBasicMaterial map={texture} transparent opacity={0.16} depthWrite={false} />
    </mesh>
  );
}

type DotRegion = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  step: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  base: THREE.Color;
  intensity: number;
};

/** Builds a points cloud with an elliptical radial fade baked into vertex colors. */
function buildDotGeometry(regions: DotRegion[]) {
  const positions: number[] = [];
  const colors: number[] = [];

  for (const region of regions) {
    const cos = Math.cos(-region.rot);
    const sin = Math.sin(-region.rot);

    for (let y = region.y0; y <= region.y1; y += region.step) {
      for (let x = region.x0; x <= region.x1; x += region.step) {
        const dx = x - region.cx;
        const dy = y - region.cy;
        const ex = (dx * cos - dy * sin) / region.rx;
        const ey = (dx * sin + dy * cos) / region.ry;
        const distance = Math.sqrt(ex * ex + ey * ey);

        let fade = 1 - distance;
        if (fade <= 0.05) continue;
        fade = Math.pow(Math.min(fade, 1), 1.4) * region.intensity;

        const point = vec(x, y, 1);
        positions.push(point.x, point.y, point.z);
        colors.push(region.base.r * fade, region.base.g * fade, region.base.b * fade);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function DotMatrix({ reduced }: { reduced: boolean }) {
  const sprite = useMemo(() => createDotTexture(), []);
  const geometry = useMemo(
    () =>
      buildDotGeometry([
        {
          x0: 766,
          x1: 1258,
          y0: 88,
          y1: 558,
          step: 7,
          cx: 1097,
          cy: 306,
          rx: 320,
          ry: 252,
          rot: (14 * Math.PI) / 180,
          base: new THREE.Color("#cfcabf"),
          intensity: 0.85,
        },
        {
          x0: 1256,
          x1: 1668,
          y0: 372,
          y1: 612,
          step: 8,
          cx: 1472,
          cy: 515,
          rx: 320,
          ry: 192,
          rot: (-8 * Math.PI) / 180,
          base: new THREE.Color("#e4cda2"),
          intensity: 0.5,
        },
      ]),
    [],
  );
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (reduced || !pointsRef.current) return;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.72 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={2.5}
        map={sprite}
        vertexColors
        transparent
        opacity={0.78}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </points>
  );
}

/** Faint structural web — panel outlines, verticals and the long diagonal. */
const GUIDE_SEGMENTS: [[number, number], [number, number]][] = [
  [[1206, 58], [1600, 58]],
  [[1600, 58], [1600, 343]],
  [[1206, 343], [1600, 343]],
  [[1206, 58], [1206, 343]],
  [[1314, 343], [1314, 768]],
  [[1534, 281], [1534, 768]],
  [[1218, 343], [1582, 343]],
  [[1218, 768], [1582, 768]],
  [[1011, 305], [1011, 767]],
  [[1011, 767], [1314, 767]],
  [[1116, 119], [1116, 309]],
  [[1012, 304], [1012, 589]],
  [[1032, 249], [1032, 578]],
  [[1189, 117], [1189, 338]],
  [[821, 804], [1211, 341]],
];

function GuideLines() {
  const points = useMemo(
    () =>
      GUIDE_SEGMENTS.flatMap(([a, b]) => [
        vec(a[0], a[1], 0.5),
        vec(b[0], b[1], 0.5),
      ]),
    [],
  );

  return (
    <Line
      points={points}
      segments
      color="#cfc8bc"
      lineWidth={0.8}
      transparent
      opacity={0.22}
    />
  );
}

/** Bright accent lines — the hot horizontal, cool line and gold strokes. */
const ACCENT_LINES: {
  a: [number, number];
  b: [number, number];
  color: string;
  width: number;
  opacity: number;
}[] = [
  { a: [1206, 282], b: [1601, 282], color: "#f3ede0", width: 1.1, opacity: 0.7 },
  { a: [963, 519], b: [1584, 519], color: "#fff2d7", width: 1.4, opacity: 0.85 },
  { a: [864, 589], b: [1282, 589], color: "#f5b965", width: 1.1, opacity: 0.6 },
  { a: [834, 180], b: [1115, 180], color: "#edb466", width: 1, opacity: 0.4 },
  { a: [1314, 520], b: [1585, 520], color: "#f0a24e", width: 1, opacity: 0.5 },
];

function AccentLines() {
  return (
    <>
      {ACCENT_LINES.map((line) => (
        <Line
          key={`${line.a[0]}-${line.a[1]}-${line.b[0]}`}
          points={[vec(line.a[0], line.a[1], 2), vec(line.b[0], line.b[1], 2)]}
          color={line.color}
          lineWidth={line.width}
          transparent
          opacity={line.opacity}
        />
      ))}
    </>
  );
}

const BEAM_A = vec(852, 762);
const BEAM_B = vec(1209, 348);

function Beam({ reduced }: { reduced: boolean }) {
  const texture = useMemo(() => createBeamTexture(), []);
  const bloomRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const { mid, length, angle } = useMemo(() => {
    const direction = BEAM_B.clone().sub(BEAM_A);
    return {
      mid: BEAM_A.clone().add(BEAM_B).multiplyScalar(0.5),
      length: direction.length(),
      angle: Math.atan2(direction.y, direction.x),
    };
  }, []);

  useFrame((state) => {
    const pulse = reduced
      ? 1
      : 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.18;
    if (bloomRef.current) {
      (bloomRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * pulse;
    }
    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity =
        Math.min(1, 0.88 * pulse);
    }
  });

  return (
    <group>
      <group position={[mid.x, mid.y, 6]} rotation={[0, 0, angle]}>
        <mesh ref={bloomRef} position={[0, 0, -0.5]}>
          <planeGeometry args={[length * 1.08, 150]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={coreRef}>
          <planeGeometry args={[length, 46]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <Line
        points={[
          vec(BEAM_A.x + VIEW_W / 2, VIEW_H / 2 - BEAM_A.y, 6.5),
          vec(BEAM_B.x + VIEW_W / 2, VIEW_H / 2 - BEAM_B.y, 6.5),
        ]}
        color="#fff8e5"
        lineWidth={1.4}
        transparent
        opacity={0.92}
      />
    </group>
  );
}

type NodeSpec = { x: number; y: number; r: number; color: string };

/** Glowing nodes where the bright lines intersect. */
const NODES: NodeSpec[] = [
  { x: 963, y: 519, r: 2.65, color: "#fff8ec" },
  { x: 1012, y: 589, r: 2.1, color: "#ffd49a" },
  { x: 1206, y: 282, r: 2.3, color: "#fff8ec" },
  { x: 1236, y: 282, r: 1.25, color: "#fff8ec" },
  { x: 1534, y: 282, r: 1.85, color: "#ffe3ae" },
  { x: 1263, y: 766, r: 1.65, color: "#ffcd81" },
  { x: 1093, y: 342, r: 1.3, color: "#ffdca4" },
];

function GlowNode({
  spec,
  index,
  reduced,
  glowTexture,
}: {
  spec: NodeSpec;
  index: number;
  reduced: boolean;
  glowTexture: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const pulse = reduced
      ? 1
      : 1 + Math.sin(state.clock.elapsedTime * 1.6 + index) * 0.14;
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef} position={vec(spec.x, spec.y, 7)}>
      <mesh>
        <planeGeometry args={[spec.r * 24, spec.r * 24]} />
        <meshBasicMaterial
          map={glowTexture}
          color={spec.color}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <circleGeometry args={[spec.r * 1.5, 24]} />
        <meshBasicMaterial
          color={spec.color}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function GlowNodes({ reduced }: { reduced: boolean }) {
  const glowTexture = useMemo(() => createGlowTexture(), []);

  return (
    <>
      {NODES.map((spec, index) => (
        <GlowNode
          key={`${spec.x}-${spec.y}`}
          spec={spec}
          index={index}
          reduced={reduced}
          glowTexture={glowTexture}
        />
      ))}
    </>
  );
}

/** Barely-perceptible drift so the composition feels alive without distracting. */
function Drift({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.x = reduced ? 0 : Math.sin(t * 0.16) * 6;
    groupRef.current.position.y = reduced ? 0 : Math.cos(t * 0.21) * 4;
  });

  return <group ref={groupRef}>{children}</group>;
}

function Scene({ reduced }: { reduced: boolean }) {
  return (
    <CoverGroup>
      <Background />
      <Drift reduced={reduced}>
        <Panels />
        <MicroGrid />
        <DotMatrix reduced={reduced} />
        <GuideLines />
        <AccentLines />
        <Beam reduced={reduced} />
        <GlowNodes reduced={reduced} />
      </Drift>
    </CoverGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

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
          camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.18;
          }}
        >
          <Scene reduced={reduced} />
        </Canvas>
      ) : (
        <Image
          src={FALLBACK_SRC}
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
