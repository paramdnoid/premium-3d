"use client";

import { Environment, Line } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import Image from "next/image";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

type PremiumArchitecturalObjectProps = {
  reduced?: boolean;
  className?: string;
};

type MaterialSet = {
  source: THREE.Material;
  shadowCore: THREE.Material;
  topGlass: THREE.Material;
  lowerGlass: THREE.Material;
  bevel: THREE.Material;
  goldRail: THREE.Material;
  hotRail: THREE.Material;
  coolRail: THREE.Material;
  fineRail: THREE.Material;
  node: THREE.Material;
  dot: THREE.MeshBasicMaterial;
  glow: THREE.Material;
  scratch: THREE.LineBasicMaterial;
};

const ARTWORK_SRC = "/assets/hero-architectural-source-8192.png";
const VIEW = { width: 1553, height: 1013 } as const;
const HALF_WIDTH = VIEW.width / 2;
const HALF_HEIGHT = VIEW.height / 2;

const rails = [
  { id: "top-panel-top", a: [1124, 62], b: [1553, 62], width: 1.8, depth: 8, z: 37, material: "goldRail" },
  { id: "top-panel-left", a: [1124, 62], b: [1124, 388], width: 2.3, depth: 9, z: 38, material: "hotRail" },
  { id: "top-panel-bottom", a: [1124, 388], b: [1553, 388], width: 2.2, depth: 8, z: 39, material: "goldRail" },
  { id: "top-panel-inner", a: [1124, 316], b: [1553, 316], width: 1.4, depth: 7, z: 41, material: "coolRail" },
  { id: "top-panel-right", a: [1527, 62], b: [1527, 593], width: 0.9, depth: 5, z: 34, material: "fineRail" },
  { id: "lower-panel-left", a: [1215, 388], b: [1215, 593], width: 2.1, depth: 9, z: 39, material: "hotRail" },
  { id: "lower-panel-bottom", a: [1215, 592], b: [1553, 592], width: 2.2, depth: 8, z: 40, material: "goldRail" },
  { id: "lower-panel-right", a: [1472, 316], b: [1472, 593], width: 1.1, depth: 6, z: 36, material: "goldRail" },
  { id: "far-right-rail", a: [1527, 314], b: [1527, 646], width: 1.1, depth: 6, z: 36, material: "goldRail" },
  { id: "mid-hot-line", a: [852, 592], b: [1553, 592], width: 1.45, depth: 6, z: 42, material: "hotRail" },
  { id: "lower-guide", a: [852, 694], b: [1216, 694], width: 1.15, depth: 5, z: 31, material: "goldRail" },
  { id: "left-guide", a: [905, 314], b: [905, 895], width: 1.25, depth: 5, z: 32, material: "goldRail" },
  { id: "upper-hairline", a: [675, 213], b: [1018, 213], width: 1.1, depth: 5, z: 26, material: "fineRail" },
  { id: "top-dot-rail", a: [1191, 86], b: [1460, 86], width: 0.85, depth: 4, z: 28, material: "fineRail" },
  { id: "center-dot-left", a: [970, 322], b: [970, 694], width: 0.85, depth: 4, z: 29, material: "fineRail" },
  { id: "center-dot-right", a: [1102, 388], b: [1102, 592], width: 0.85, depth: 4, z: 30, material: "fineRail" },
  { id: "lower-panel-inner-a", a: [1215, 664], b: [1404, 664], width: 0.8, depth: 4, z: 29, material: "fineRail" },
  { id: "lower-panel-inner-b", a: [1215, 744], b: [1404, 744], width: 0.8, depth: 4, z: 29, material: "fineRail" },
  { id: "lower-panel-inner-c", a: [1404, 664], b: [1404, 895], width: 0.8, depth: 4, z: 29, material: "fineRail" },
  { id: "diagonal-main", a: [696, 1013], b: [1124, 388], width: 1.5, depth: 6, z: 35, material: "goldRail" },
  { id: "diagonal-glow", a: [908, 694], b: [1124, 388], width: 4.8, depth: 10, z: 47, material: "hotRail" },
] as const;

const nodes = [
  { id: "junction-top", x: 1124, y: 388, radius: 6.8, z: 57 },
  { id: "junction-lower", x: 1215, y: 592, radius: 5.2, z: 56 },
  { id: "node-mid", x: 1262, y: 316, radius: 4.5, z: 56 },
  { id: "node-left", x: 906, y: 694, radius: 4.6, z: 54 },
  { id: "node-deep-left", x: 852, y: 592, radius: 3.6, z: 49 },
  { id: "node-low-guide", x: 1254, y: 893, radius: 2.7, z: 48 },
  { id: "node-right", x: 1527, y: 489, radius: 3.1, z: 55 },
  { id: "node-edge", x: 1527, y: 643, radius: 2.8, z: 55 },
  { id: "node-top-small", x: 1383, y: 145, radius: 2.8, z: 54 },
] as const;

const glows = [
  { id: "large-corner", x: 1124, y: 388, scale: 210, opacity: 0.75, z: 48 },
  { id: "diagonal-bloom", x: 1048, y: 493, scale: 240, opacity: 0.45, z: 43 },
  { id: "lower-bloom", x: 1215, y: 592, scale: 170, opacity: 0.55, z: 46 },
  { id: "top-left-bloom", x: 1124, y: 316, scale: 120, opacity: 0.4, z: 45 },
  { id: "lower-left-bloom", x: 908, y: 694, scale: 120, opacity: 0.28, z: 42 },
  { id: "top-dot-bloom", x: 988, y: 142, scale: 92, opacity: 0.22, z: 38 },
] as const;

const scratchLines = [
  [[1170, 164], [1142, 296], [1147, 386]],
  [[1206, 173], [1184, 286], [1197, 378]],
  [[1242, 206], [1228, 315], [1236, 384]],
  [[1252, 426], [1324, 442], [1444, 465]],
  [[1264, 472], [1378, 489], [1518, 514]],
  [[1230, 535], [1328, 560], [1512, 584]],
  [[1304, 410], [1416, 432], [1520, 459]],
  [[1266, 562], [1390, 578], [1528, 589]],
] as const;

function detectWebGLSupport() {
  const canvas = document.createElement("canvas");
  const gl = (
    canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true })
  ) as WebGLRenderingContext | WebGL2RenderingContext | null;

  if (!gl) return false;

  return gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 8192;
}

function worldPoint(x: number, y: number, z = 0): [number, number, number] {
  return [x - HALF_WIDTH, HALF_HEIGHT - y, z];
}

function createGlowTexture() {
  const size = 192;
  const data = new Uint8Array(size * size * 4);
  const center = (size - 1) / 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x - center) / center;
      const dy = (y - center) / center;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const halo = Math.max(0, 1 - radius);
      const core = Math.max(0, 1 - radius * 2.85);
      const alpha = Math.pow(halo, 3.2) * 0.9 + Math.pow(core, 1.4) * 0.85;
      const index = (y * size + x) * 4;

      data[index] = 255;
      data[index + 1] = 227;
      data[index + 2] = 166;
      data[index + 3] = Math.round(Math.min(1, alpha) * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createGrainTexture() {
  const size = 128;
  const data = new Uint8Array(size * size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const noise = grain - Math.floor(grain);
      data[y * size + x] = Math.round(108 + noise * 92);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 8);
  texture.needsUpdate = true;
  return texture;
}

function createMaterials(texture: THREE.Texture): MaterialSet {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  const grain = createGrainTexture();
  const glowTexture = createGlowTexture();

  const glass = (color: string, emissive: string, opacity: number) =>
    new THREE.MeshPhysicalMaterial({
      color,
      emissive,
      emissiveIntensity: 0.34,
      metalness: 0.72,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      reflectivity: 0.88,
      transparent: true,
      opacity,
      transmission: 0.08,
      thickness: 28,
      bumpMap: grain,
      bumpScale: 2.1,
    });

  const additive = (color: string, opacity: number) =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

  return {
    source: new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      opacity: 1,
      depthWrite: false,
      toneMapped: false,
    }),
    shadowCore: new THREE.MeshPhysicalMaterial({
      color: "#030404",
      emissive: "#080705",
      emissiveIntensity: 0.12,
      metalness: 0.84,
      roughness: 0.28,
      clearcoat: 0.8,
      clearcoatRoughness: 0.11,
      transparent: true,
      opacity: 0.44,
      bumpMap: grain,
      bumpScale: 3.4,
    }),
    topGlass: glass("#131517", "#20252b", 0.74),
    lowerGlass: glass("#0f1112", "#17130c", 0.68),
    bevel: new THREE.MeshPhysicalMaterial({
      color: "#d8b36f",
      emissive: "#c9872e",
      emissiveIntensity: 0.28,
      metalness: 0.96,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    goldRail: additive("#f4be65", 0.68),
    hotRail: additive("#fff0c7", 0.95),
    coolRail: additive("#fff8e8", 0.52),
    fineRail: additive("#b99a60", 0.28),
    node: additive("#fff8e9", 0.94),
    dot: new THREE.MeshBasicMaterial({
      color: "#f1b65c",
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      vertexColors: true,
    }),
    glow: new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
    scratch: new THREE.LineBasicMaterial({
      color: "#c7954f",
      transparent: true,
      opacity: 0.23,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  };
}

function CoverGroup({ children }: { children: ReactNode }) {
  const size = useThree((state) => state.size);
  const scale = Math.max(size.width / VIEW.width, size.height / VIEW.height);

  return <group scale={[scale, scale, scale]}>{children}</group>;
}

function Panel({
  x,
  y,
  width,
  height,
  depth,
  z,
  material,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  z: number;
  material: THREE.Material;
}) {
  return (
    <mesh position={worldPoint(x + width / 2, y + height / 2, z)} material={material}>
      <boxGeometry args={[width, height, depth, 1, 1, 3]} />
    </mesh>
  );
}

function Rail({
  a,
  b,
  width,
  depth,
  z,
  material,
}: {
  a: readonly [number, number];
  b: readonly [number, number];
  width: number;
  depth: number;
  z: number;
  material: THREE.Material;
}) {
  const [ax, ay] = worldPoint(a[0], a[1]);
  const [bx, by] = worldPoint(b[0], b[1]);
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);

  return (
    <mesh
      position={[(ax + bx) / 2, (ay + by) / 2, z]}
      rotation={[0, 0, angle]}
      material={material}
    >
      <boxGeometry args={[length, width, depth]} />
    </mesh>
  );
}

function GlowPlane({
  x,
  y,
  scale,
  opacity,
  z,
  material,
}: {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  z: number;
  material: THREE.Material;
}) {
  const glowMaterial = useMemo(() => {
    const clone = material.clone();
    if ("opacity" in clone) {
      clone.opacity = opacity;
    }
    clone.transparent = true;
    return clone;
  }, [material, opacity]);

  return (
    <mesh position={worldPoint(x, y, z)} scale={[scale, scale, 1]} material={glowMaterial}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

function SparkNode({
  x,
  y,
  radius,
  z,
  materials,
}: {
  x: number;
  y: number;
  radius: number;
  z: number;
  materials: MaterialSet;
}) {
  return (
    <group position={worldPoint(x, y, z)}>
      <mesh scale={[radius, radius, radius * 0.62]} material={materials.node}>
        <sphereGeometry args={[1, 24, 12]} />
      </mesh>
      <mesh scale={[radius * 9, radius * 9, 1]} position={[0, 0, -2]} material={materials.glow}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}

function hash2(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createDots() {
  const dots: Array<{ x: number; y: number; z: number; scale: number; color: THREE.Color }> = [];
  const regions = [
    { x0: 902, x1: 1130, y0: 68, y1: 388, step: 12, cx: 1035, cy: 244, radius: 230, density: 0.92 },
    { x0: 870, x1: 1220, y0: 318, y1: 890, step: 11, cx: 1068, cy: 580, radius: 330, density: 0.72 },
    { x0: 1228, x1: 1540, y0: 908, y1: 1008, step: 11, cx: 1394, cy: 960, radius: 230, density: 0.78 },
    { x0: 1260, x1: 1455, y0: 22, y1: 74, step: 10, cx: 1355, cy: 50, radius: 150, density: 0.54 },
  ];

  for (const region of regions) {
    for (let y = region.y0; y <= region.y1; y += region.step) {
      for (let x = region.x0; x <= region.x1; x += region.step) {
        const dx = x - region.cx;
        const dy = y - region.cy;
        const falloff = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / region.radius);
        if (hash2(x, y) > region.density * (0.22 + falloff * 0.9)) continue;

        const warm = 0.55 + hash2(y, x) * 0.45;
        dots.push({
          x: x + (hash2(x + 3, y) - 0.5) * 1.8,
          y: y + (hash2(x, y + 7) - 0.5) * 1.8,
          z: 30 + falloff * 22 + hash2(x + 11, y + 17) * 10,
          scale: 0.8 + falloff * 1.65 + hash2(x + 31, y + 37) * 0.65,
          color: new THREE.Color().setRGB(1, 0.58 + warm * 0.22, 0.22 + warm * 0.26),
        });
      }
    }
  }

  return dots;
}

function DotField({ material }: { material: THREE.MeshBasicMaterial }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dots = useMemo(() => createDots(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();

    dots.forEach((dot, index) => {
      const [x, y, z] = worldPoint(dot.x, dot.y, dot.z);
      matrix.compose(
        new THREE.Vector3(x, y, z),
        quaternion,
        new THREE.Vector3(dot.scale, dot.scale, dot.scale * 0.55),
      );
      meshRef.current?.setMatrixAt(index, matrix);
      meshRef.current?.setColorAt(index, dot.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [dots]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, dots.length]} material={material}>
      <sphereGeometry args={[1, 10, 6]} />
    </instancedMesh>
  );
}

function DetailScratches({ material }: { material: THREE.LineBasicMaterial }) {
  return (
    <group>
      {scratchLines.map((line, index) => (
        <Line
          key={index}
          points={line.map(([x, y]) => worldPoint(x, y, 48))}
          color={material.color}
          lineWidth={0.48}
          transparent
          opacity={material.opacity}
          depthWrite={false}
        />
      ))}
    </group>
  );
}

function distanceToSegment(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / lengthSq));
  const px = ax + t * dx;
  const py = ay + t * dy;
  return Math.hypot(x - px, y - py);
}

function insideRect(x: number, y: number, rx: number, ry: number, width: number, height: number) {
  return x >= rx && x <= rx + width && y >= ry && y <= ry + height;
}

function edgeRelief(x: number, y: number, rx: number, ry: number, width: number, height: number) {
  if (!insideRect(x, y, rx, ry, width, height)) return 0;

  const edgeDistance = Math.min(x - rx, rx + width - x, y - ry, ry + height - y);
  return Math.max(0, 1 - edgeDistance / 22);
}

function createReliefGeometry() {
  const geometry = new THREE.PlaneGeometry(VIEW.width, VIEW.height, 256, 168);
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;

  for (let index = 0; index < position.count; index += 1) {
    const px = position.getX(index);
    const py = position.getY(index);
    const x = px + HALF_WIDTH;
    const y = HALF_HEIGHT - py;

    const topPanel = insideRect(x, y, 1124, 62, 429, 326) ? 4.5 : 0;
    const lowerPanel = insideRect(x, y, 1215, 388, 338, 205) ? 3.2 : 0;
    const deepPanel = insideRect(x, y, 904, 540, 314, 354) ? -5.5 : 0;
    const panelEdges =
      edgeRelief(x, y, 1124, 62, 429, 326) * 10 +
      edgeRelief(x, y, 1215, 388, 338, 205) * 8 +
      edgeRelief(x, y, 904, 540, 314, 354) * 5;
    const diagonal =
      Math.exp(-distanceToSegment(x, y, 696, 1013, 1124, 388) / 16) * 17;
    const midHot = Math.exp(-distanceToSegment(x, y, 852, 592, 1553, 592) / 11) * 10;
    const topHot = Math.exp(-distanceToSegment(x, y, 1124, 316, 1553, 316) / 14) * 8;
    const dotRelief =
      (insideRect(x, y, 900, 60, 232, 330) ? 1.6 : 0) +
      (insideRect(x, y, 880, 318, 340, 574) ? 1.2 : 0);

    const grain = (hash2(Math.round(x), Math.round(y)) - 0.5) * 1.4;
    position.setZ(
      index,
      12 + topPanel + lowerPanel + deepPanel + panelEdges + diagonal + midHot + topHot + dotRelief + grain,
    );
  }

  geometry.computeVertexNormals();
  return geometry;
}

function ReliefSourceSurface({ material }: { material: THREE.Material }) {
  const geometry = useMemo(() => createReliefGeometry(), []);

  return <mesh geometry={geometry} material={material} position={[0, 0, 0]} />;
}

function ArchitecturalObject({ reduced }: { reduced: boolean }) {
  const texture = useLoader(THREE.TextureLoader, ARTWORK_SRC);
  const materials = useMemo(() => createMaterials(texture), [texture]);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = reduced ? -0.04 : -0.045 + Math.sin(t * 0.18) * 0.01;
    groupRef.current.rotation.y = reduced ? -0.26 : -0.27 + Math.sin(t * 0.13) * 0.035;
    groupRef.current.rotation.z = reduced ? 0.014 : 0.014 + Math.cos(t * 0.11) * 0.008;
    groupRef.current.position.y = reduced ? -12 : -12 + Math.sin(t * 0.21) * 8;
  });

  return (
    <group ref={groupRef} position={[34, -12, 0]}>
      <Panel x={1118} y={58} width={438} height={334} depth={34} z={-34} material={materials.topGlass} />
      <Panel x={1212} y={386} width={346} height={211} depth={30} z={-38} material={materials.lowerGlass} />
      <Panel x={904} y={540} width={316} height={354} depth={18} z={-52} material={materials.shadowCore} />
      <Panel x={1215} y={592} width={338} height={302} depth={16} z={-58} material={materials.shadowCore} />
      <Panel x={1214} y={386} width={8} height={211} depth={42} z={-14} material={materials.bevel} />
      <Panel x={1120} y={384} width={438} height={8} depth={38} z={-12} material={materials.bevel} />
      <Panel x={1120} y={58} width={8} height={330} depth={36} z={-10} material={materials.bevel} />

      <ReliefSourceSurface material={materials.source} />

      <DotField material={materials.dot} />
      <DetailScratches material={materials.scratch} />

      {rails.map((rail) => (
        <Rail
          key={rail.id}
          a={rail.a}
          b={rail.b}
          width={rail.width}
          depth={rail.depth}
          z={rail.z}
          material={materials[rail.material]}
        />
      ))}

      {glows.map((glow) => (
        <GlowPlane
          key={glow.id}
          x={glow.x}
          y={glow.y}
          scale={glow.scale}
          opacity={glow.opacity}
          z={glow.z}
          material={materials.glow}
        />
      ))}

      {nodes.map((node) => (
        <SparkNode key={node.id} {...node} materials={materials} />
      ))}
    </group>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  return (
    <CoverGroup>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[-4.8, 5.2, 7]} intensity={1.7} color="#fff6e0" />
      <directionalLight position={[4, -2.3, 5.5]} intensity={0.72} color="#dbe9ff" />
      <spotLight
        position={[-210, 260, 520]}
        angle={0.24}
        penumbra={0.72}
        intensity={610}
        color="#fff5d2"
        distance={1100}
        decay={2}
      />
      <pointLight position={[1124 - HALF_WIDTH, HALF_HEIGHT - 388, 140]} intensity={190} color="#ffd58e" distance={520} decay={2} />
      <pointLight position={[1215 - HALF_WIDTH, HALF_HEIGHT - 592, 120]} intensity={120} color="#f3ae52" distance={420} decay={2} />
      <Environment preset="city" environmentIntensity={0.46} />
      <ArchitecturalObject reduced={reduced} />
    </CoverGroup>
  );
}

function StaticFallback() {
  return (
    <div className="absolute inset-0 bg-[#050505]">
      <Image
        src={ARTWORK_SRC}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="h-full w-full object-cover object-[58%_50%] opacity-90 drop-shadow-[0_0_46px_rgba(244,190,101,0.34)]"
      />
    </div>
  );
}

export function PremiumArchitecturalObject({
  reduced = false,
  className,
}: PremiumArchitecturalObjectProps) {
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
      className={`pointer-events-none relative h-full w-full overflow-hidden bg-[#050505] ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_38%,rgba(255,205,126,0.14),transparent_34%),radial-gradient(ellipse_at_54%_58%,rgba(255,255,255,0.05),transparent_48%)]" />
      {webglSupported ? (
        <Canvas
          orthographic
          dpr={[1, 2]}
          camera={{ position: [0, 0, 1250], zoom: 1, near: 0.1, far: 2500 }}
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.28;
          }}
        >
          <Scene reduced={reduced} />
        </Canvas>
      ) : (
        <StaticFallback />
      )}
    </div>
  );
}
