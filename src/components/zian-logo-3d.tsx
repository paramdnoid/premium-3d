"use client";

import { Environment, Float, Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Point2 = [number, number];
type Point3 = [number, number, number];

const outerPath: Point2[] = [
  [0, 1.62],
  [1.04, 1.02],
  [1.04, -0.56],
  [0, -1.64],
  [-1.04, -0.56],
  [-1.04, 1.02],
];

const innerPath: Point2[] = [
  [0, 1.22],
  [0.72, 0.8],
  [0.72, -0.36],
  [0, -1.12],
  [-0.72, -0.36],
  [-0.72, 0.8],
];

const zianZPath: Point2[] = [
  [-0.88, 0.76],
  [0.88, 0.76],
  [0.88, 0.33],
  [-0.08, -0.28],
  [0.88, -0.28],
  [0.88, -0.72],
  [-0.88, -0.72],
  [-0.88, -0.28],
  [0.08, 0.33],
  [-0.88, 0.33],
];

const frontFacets: { points: Point2[]; color: string; opacity: number; roughness: number }[] = [
  {
    points: [
      outerPath[0],
      outerPath[1],
      [0.72, 0.8],
      [0, 1.05],
      [-0.72, 0.8],
      outerPath[5],
    ],
    color: "#222222",
    opacity: 0.5,
    roughness: 0.58,
  },
  {
    points: [outerPath[5], [-0.72, 0.8], [-0.44, -0.36], outerPath[4]],
    color: "#888888",
    opacity: 0.08,
    roughness: 0.72,
  },
  {
    points: [outerPath[1], outerPath[2], [0.44, -0.36], [0.72, 0.8]],
    color: "#ffffff",
    opacity: 0.09,
    roughness: 0.42,
  },
  {
    points: [[-0.72, 0.8], [0, 1.05], [0.44, -0.36], [0, -1.12], [-0.44, -0.36]],
    color: "#0a0a0a",
    opacity: 0.46,
    roughness: 0.86,
  },
  {
    points: [outerPath[4], [-0.44, -0.36], [0, -1.12], outerPath[3]],
    color: "#000000",
    opacity: 0.52,
    roughness: 0.7,
  },
  {
    points: [outerPath[2], outerPath[3], [0, -1.12], [0.44, -0.36]],
    color: "#555555",
    opacity: 0.08,
    roughness: 0.5,
  },
];

function createShape(points: Point2[]) {
  const shape = new THREE.Shape();
  const [firstX, firstY] = points[0];

  shape.moveTo(firstX, firstY);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();

  return shape;
}

function closeLine(points: Point2[], z: number): Point3[] {
  return [...points, points[0]].map(([x, y]) => [x, y, z]);
}

function ZianLogoModel() {
  const groupRef = useRef<THREE.Group>(null);
  const rimRef = useRef<THREE.MeshStandardMaterial>(null);
  const zRef = useRef<THREE.MeshStandardMaterial>(null);

  const geometry = useMemo(() => {
    const shell = new THREE.ExtrudeGeometry(createShape(outerPath), {
      depth: 0.56,
      bevelEnabled: true,
      bevelSegments: 12,
      bevelSize: 0.052,
      bevelThickness: 0.058,
      curveSegments: 16,
      steps: 3,
    });
    const core = new THREE.ExtrudeGeometry(createShape(innerPath), {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.018,
      bevelThickness: 0.028,
      curveSegments: 12,
      steps: 1,
    });
    const z = new THREE.ExtrudeGeometry(createShape(zianZPath), {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 10,
      bevelSize: 0.026,
      bevelThickness: 0.034,
      curveSegments: 12,
      steps: 2,
    });
    const facets = frontFacets.map((facet) => new THREE.ShapeGeometry(createShape(facet.points)));
    const edge = new THREE.ExtrudeGeometry(createShape(outerPath), {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      curveSegments: 12,
      steps: 1,
    });

    shell.center();
    core.center();
    z.center();
    edge.center();

    return { core, edge, facets, shell, z };
  }, []);

  const materials = useMemo(
    () => ({
      shell: new THREE.MeshPhysicalMaterial({
        color: "#090909",
        metalness: 0.58,
        roughness: 0.56,
        clearcoat: 0.5,
        clearcoatRoughness: 0.32,
        reflectivity: 0.42,
      }),
      backMass: new THREE.MeshStandardMaterial({
        color: "#000000",
        metalness: 0.46,
        roughness: 0.76,
      }),
      core: new THREE.MeshPhysicalMaterial({
        color: "#0a0a0a",
        metalness: 0.62,
        roughness: 0.48,
        clearcoat: 0.42,
        clearcoatRoughness: 0.28,
        reflectivity: 0.48,
        transparent: true,
        opacity: 0.58,
      }),
      rim: new THREE.MeshStandardMaterial({
        color: "#c9cec5",
        emissive: "#dde4da",
        emissiveIntensity: 0.11,
        metalness: 1,
        roughness: 0.26,
        transparent: true,
        opacity: 0.42,
      }),
      z: new THREE.MeshPhysicalMaterial({
        color: "#5f605d",
        emissive: "#000000",
        emissiveIntensity: 0,
        metalness: 1,
        roughness: 0.24,
        clearcoat: 0.62,
        clearcoatRoughness: 0.2,
        reflectivity: 0.54,
      }),
      zSide: new THREE.MeshStandardMaterial({
        color: "#171817",
        metalness: 0.85,
        roughness: 0.3,
      }),
    }),
    [],
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.z = 0;
      groupRef.current.position.y = Math.sin(elapsed * 0.52) * 0.018;
    }

    if (rimRef.current) {
      rimRef.current.emissiveIntensity = 0.08 + Math.sin(elapsed * 1.7) * 0.025;
      rimRef.current.opacity = 0.34 + Math.sin(elapsed * 1.4) * 0.035;
    }

    if (zRef.current) {
      zRef.current.emissiveIntensity = 0;
    }
  });

  return (
    <Float speed={0.85} rotationIntensity={0} floatIntensity={0.08}>
      <group ref={groupRef} scale={1.06}>
        <mesh geometry={geometry.shell} material={materials.shell} position={[0, 0, -0.15]} />
        <mesh geometry={geometry.shell} material={materials.backMass} position={[0.08, -0.08, -0.5]} scale={1.01} />

        {geometry.facets.map((facetGeometry, index) => {
          const facet = frontFacets[index];

          return (
            <mesh key={facet.color + index} geometry={facetGeometry} position={[0, 0, 0.16]}>
              <meshStandardMaterial
                color={facet.color}
                metalness={0.86}
                opacity={facet.opacity}
                roughness={facet.roughness}
                side={THREE.DoubleSide}
                transparent
              />
            </mesh>
          );
        })}

        <mesh geometry={geometry.core} material={materials.core} position={[0, 0, 0.23]} scale={[0.98, 0.98, 1]} />
        <mesh geometry={geometry.edge} material={materials.rim} position={[0, 0, 0.31]} scale={[1.012, 1.012, 1]} ref={rimRef} />
        <mesh geometry={geometry.z} material={materials.z} position={[0, 0.12, 0.52]} ref={zRef} />
        <mesh geometry={geometry.z} material={materials.zSide} position={[0.055, 0.06, 0.38]} scale={[1.008, 1.008, 0.72]} />

        <Line points={closeLine(outerPath, 0.63)} color="#e8eee2" lineWidth={1.65} transparent opacity={0.34} />
        <Line points={closeLine(innerPath, 0.66)} color="#ecf0e8" lineWidth={0.85} transparent opacity={0.18} dashed dashSize={0.055} gapSize={0.05} />
        <Line points={[[0, 1.22, 0.67], [0, 0.78, 0.67], [0, -1.12, 0.67]]} color="#f4f7f0" lineWidth={0.62} transparent opacity={0.18} />
        <Line points={[[-0.68, 0.55, 0.68], [0.67, 0.55, 0.68]]} color="#f4f7f0" lineWidth={0.72} transparent opacity={0.2} />
        <Line points={[[-0.68, -0.49, 0.68], [0.68, -0.49, 0.68]]} color="#f4f7f0" lineWidth={0.72} transparent opacity={0.16} />
        <Line points={[[-0.58, 0.28, 0.69], [0.5, -0.42, 0.69]]} color="#f4f7f0" lineWidth={0.56} transparent opacity={0.16} />

        <mesh position={[0, -1.84, -0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.6, 0.34, 1]}>
          <circleGeometry args={[1, 64]} />
          <meshBasicMaterial color="#dce4d9" transparent opacity={0.078} depthWrite={false} />
        </mesh>

        <Sparkles count={34} scale={[2.8, 3.5, 1.2]} size={1.2} speed={0.25} color="#f4d7a1" opacity={0.2} />
      </group>
    </Float>
  );
}

export default function ZianLogo3D() {
  return (
    <div className="zian-logo-3d-stage" aria-hidden="true">
      <Image
        className="zian-logo-3d-fallback"
        src="/zian-monolith-signet.svg"
        alt=""
        width={360}
        height={360}
        priority
        unoptimized
        draggable={false}
      />
      <Canvas
        orthographic
        camera={{ position: [0, 0, 7], zoom: 96, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <ambientLight intensity={0.46} />
        <directionalLight position={[-2.4, 2.8, 4.8]} intensity={1.2} color="#f6f6ee" />
        <directionalLight position={[2.8, -1.2, 3.4]} intensity={0.42} color="#cccccc" />
        <pointLight position={[0.2, 1.8, 2.6]} intensity={5.2} color="#dde4da" distance={5.6} decay={2.2} />
        <pointLight position={[-1.6, -1.1, 2.4]} intensity={2.4} color="#ffffff" distance={4.2} decay={2} />
        <Environment preset="city" environmentIntensity={0.22} />
        <ZianLogoModel />
      </Canvas>
    </div>
  );
}
