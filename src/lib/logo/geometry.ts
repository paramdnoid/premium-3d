import * as THREE from "three";

export type Point2 = [number, number];
export type Point3 = [number, number, number];

/** Outer hexagon silhouette of the signet. */
export const outerPath: Point2[] = [
  [0, 1.62],
  [1.04, 1.02],
  [1.04, -0.56],
  [0, -1.64],
  [-1.04, -0.56],
  [-1.04, 1.02],
];

/** Inner hexagon — the core. */
export const innerPath: Point2[] = [
  [0, 1.22],
  [0.72, 0.8],
  [0.72, -0.36],
  [0, -1.12],
  [-0.72, -0.36],
  [-0.72, 0.8],
];

/** The "Z" letterform. */
export const zianZPath: Point2[] = [
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

/** Mirrored "Z" used on the rear face. */
export const rearZPath: Point2[] = zianZPath.map(([x, y]) => [-x, y]);

/** The six art-directed front facets that catch light across the shell. */
export const frontFacets: {
  points: Point2[];
  color: string;
  opacity: number;
  roughness: number;
}[] = [
  {
    points: [outerPath[0], outerPath[1], [0.72, 0.8], [0, 1.05], [-0.72, 0.8], outerPath[5]],
    color: "#151716",
    opacity: 0.36,
    roughness: 0.58,
  },
  {
    points: [outerPath[5], [-0.72, 0.8], [-0.44, -0.36], outerPath[4]],
    color: "#6d716b",
    opacity: 0.06,
    roughness: 0.7,
  },
  {
    points: [outerPath[1], outerPath[2], [0.44, -0.36], [0.72, 0.8]],
    color: "#d4d7cf",
    opacity: 0.08,
    roughness: 0.44,
  },
  {
    points: [[-0.72, 0.8], [0, 1.05], [0.44, -0.36], [0, -1.12], [-0.44, -0.36]],
    color: "#050606",
    opacity: 0.44,
    roughness: 0.84,
  },
  {
    points: [outerPath[4], [-0.44, -0.36], [0, -1.12], outerPath[3]],
    color: "#050505",
    opacity: 0.46,
    roughness: 0.72,
  },
  {
    points: [outerPath[2], outerPath[3], [0, -1.12], [0.44, -0.36]],
    color: "#555851",
    opacity: 0.06,
    roughness: 0.54,
  },
];

function createShape(points: Point2[]): THREE.Shape {
  const shape = new THREE.Shape();
  const [firstX, firstY] = points[0];

  shape.moveTo(firstX, firstY);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();

  return shape;
}

function createStripShape(start: Point2, end: Point2, width: number): THREE.Shape {
  const [sx, sy] = start;
  const [ex, ey] = end;
  const dx = ex - sx;
  const dy = ey - sy;
  const length = Math.hypot(dx, dy) || 1;
  const nx = (-dy / length) * (width / 2);
  const ny = (dx / length) * (width / 2);

  return createShape([
    [sx + nx, sy + ny],
    [ex + nx, ey + ny],
    [ex - nx, ey - ny],
    [sx - nx, sy - ny],
  ]);
}

function createRaisedStripsGeometry(
  strokes: [Point2, Point2][],
  width: number,
  depth: number,
) {
  return new THREE.ExtrudeGeometry(strokes.map(([start, end]) => createStripShape(start, end, width)), {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: Math.min(width * 0.22, 0.006),
    bevelThickness: Math.min(depth * 0.45, 0.006),
    curveSegments: 4,
    steps: 1,
  });
}

function createMicroEtchTexture(): THREE.DataTexture {
  const size = 64;
  const data = new Uint8Array(size * size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const diagonal = ((x + y * 1.7) % 17) / 17;
      const cross = ((x * 1.9 - y) % 23) / 23;
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const noise = grain - Math.floor(grain);
      const value = 138 + diagonal * 34 + cross * 18 + noise * 24;
      data[y * size + x] = Math.max(0, Math.min(255, Math.round(value)));
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.5, 3.5);
  texture.needsUpdate = true;
  return texture;
}

const zInsetStrokes: [Point2, Point2][] = [
  [
    [-0.72, 0.61],
    [0.62, 0.61],
  ],
  [
    [-0.47, -0.38],
    [0.42, 0.18],
  ],
  [
    [-0.62, -0.56],
    [0.68, -0.56],
  ],
];

/** Closes a 2D path into a 3D line loop at the given depth. */
export function closeLine(points: Point2[], z: number): Point3[] {
  return [...points, points[0]].map(([x, y]) => [x, y, z]);
}

export type GeometryKey =
  | "shell"
  | "core"
  | "z"
  | "edge"
  | "rearPanel"
  | "rearInset"
  | "rearZ"
  | "outerRails"
  | "innerRails"
  | "zInlays"
  | "facet0"
  | "facet1"
  | "facet2"
  | "facet3"
  | "facet4"
  | "facet5";

export type LogoGeometry = Record<GeometryKey, THREE.BufferGeometry>;

/**
 * Builds every geometry of the signet. The primary silhouette is kept intact
 * while cinematic detail layers add grouped raised rails and Z inlays.
 * Bounding boxes are pre-computed — the choreography uses them to find pivots.
 */
export function createLogoGeometry(): LogoGeometry {
  const shell = new THREE.ExtrudeGeometry(createShape(outerPath), {
    depth: 0.56,
    bevelEnabled: true,
    bevelSegments: 16,
    bevelSize: 0.06,
    bevelThickness: 0.066,
    curveSegments: 18,
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
  const edge = new THREE.ExtrudeGeometry(createShape(outerPath), {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 0.022,
    bevelThickness: 0.022,
    curveSegments: 12,
    steps: 1,
  });
  const rearPanel = new THREE.ShapeGeometry(createShape(outerPath));
  const rearInset = new THREE.ShapeGeometry(createShape(innerPath));
  const rearZ = new THREE.ShapeGeometry(createShape(rearZPath));

  shell.center();
  core.center();
  z.center();
  edge.center();

  const facets = frontFacets.map((facet) => new THREE.ShapeGeometry(createShape(facet.points)));
  const outerRails = createRaisedStripsGeometry(
    outerPath.map((point, index) => [point, outerPath[(index + 1) % outerPath.length]]),
    0.03,
    0.016,
  );
  const innerRails = createRaisedStripsGeometry(
    innerPath.map((point, index) => [point, innerPath[(index + 1) % innerPath.length]]),
    0.018,
    0.012,
  );
  const zInlays = createRaisedStripsGeometry(
    zInsetStrokes,
    0.024,
    0.012,
  );

  const geometry: LogoGeometry = {
    shell,
    core,
    z,
    edge,
    rearPanel,
    rearInset,
    rearZ,
    outerRails,
    innerRails,
    zInlays,
    facet0: facets[0],
    facet1: facets[1],
    facet2: facets[2],
    facet3: facets[3],
    facet4: facets[4],
    facet5: facets[5],
  };

  for (const geom of Object.values(geometry)) {
    geom.computeBoundingBox();
  }

  return geometry;
}

export type MaterialKey =
  | "shell"
  | "core"
  | "z"
  | "outerRail"
  | "innerRail"
  | "zInset"
  | "rearPanel"
  | "rearInset"
  | "rearZ"
  | "rearShadow"
  | "rim"
  | "facet0"
  | "facet1"
  | "facet2"
  | "facet3"
  | "facet4"
  | "facet5";

export type LogoMaterials = Record<MaterialKey, THREE.Material>;

/** Builds every material of the signet. */
export function createLogoMaterials(): LogoMaterials {
  const microEtch = createMicroEtchTexture();
  const facetMaterials = frontFacets.map(
    (facet) =>
      new THREE.MeshPhysicalMaterial({
        color: facet.color,
        metalness: 0.94,
        opacity: facet.opacity,
        roughness: Math.max(0.14, facet.roughness - 0.16),
        clearcoat: 0.68,
        clearcoatRoughness: 0.18,
        bumpMap: microEtch,
        bumpScale: 0.008,
        side: THREE.DoubleSide,
        transparent: true,
      }),
  );

  return {
    shell: new THREE.MeshPhysicalMaterial({
      color: "#030504",
      emissive: "#09100b",
      emissiveIntensity: 0.075,
      metalness: 0.9,
      roughness: 0.24,
      clearcoat: 0.78,
      clearcoatRoughness: 0.14,
      bumpMap: microEtch,
      bumpScale: 0.01,
    }),
    core: new THREE.MeshPhysicalMaterial({
      color: "#070908",
      emissive: "#10140f",
      emissiveIntensity: 0.05,
      metalness: 0.4,
      roughness: 0.48,
      clearcoat: 0.82,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.84,
      bumpMap: microEtch,
      bumpScale: 0.006,
    }),
    z: new THREE.MeshPhysicalMaterial({
      color: "#f0f3ea",
      emissive: "#cdd5c5",
      emissiveIntensity: 0.22,
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.035,
      reflectivity: 0.92,
      bumpMap: microEtch,
      bumpScale: 0.004,
    }),
    outerRail: new THREE.MeshPhysicalMaterial({
      color: "#d7ddd0",
      emissive: "#8a947f",
      emissiveIntensity: 0.2,
      metalness: 1,
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.025,
      bumpMap: microEtch,
      bumpScale: 0.003,
    }),
    innerRail: new THREE.MeshPhysicalMaterial({
      color: "#252922",
      emissive: "#070907",
      emissiveIntensity: 0.09,
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 0.82,
      clearcoatRoughness: 0.08,
      bumpMap: microEtch,
      bumpScale: 0.005,
    }),
    zInset: new THREE.MeshPhysicalMaterial({
      color: "#fbfff2",
      emissive: "#edf7df",
      emissiveIntensity: 0.3,
      metalness: 1,
      roughness: 0.045,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
    }),
    rearPanel: new THREE.MeshPhysicalMaterial({
      color: "#111511",
      emissive: "#10170f",
      emissiveIntensity: 0.12,
      metalness: 0.88,
      opacity: 0.92,
      roughness: 0.2,
      clearcoat: 0.74,
      clearcoatRoughness: 0.12,
      side: THREE.DoubleSide,
      transparent: true,
    }),
    rearInset: new THREE.MeshPhysicalMaterial({
      color: "#1b1f1a",
      emissive: "#111811",
      emissiveIntensity: 0.12,
      metalness: 0.9,
      opacity: 0.58,
      roughness: 0.14,
      clearcoat: 0.78,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide,
      transparent: true,
    }),
    rearZ: new THREE.MeshStandardMaterial({
      color: "#eef3e7",
      emissive: "#dbe6d2",
      emissiveIntensity: 0.22,
      metalness: 0.94,
      opacity: 0.18,
      roughness: 0.08,
      side: THREE.DoubleSide,
      transparent: true,
    }),
    rearShadow: new THREE.MeshStandardMaterial({
      color: "#070908",
      emissive: "#030504",
      emissiveIntensity: 0.04,
      metalness: 0.76,
      roughness: 0.48,
    }),
    rim: new THREE.MeshStandardMaterial({
      color: "#fbfff4",
      emissive: "#f9ffe9",
      emissiveIntensity: 0.28,
      metalness: 1,
      opacity: 0.16,
      roughness: 0.06,
      transparent: true,
    }),
    facet0: facetMaterials[0],
    facet1: facetMaterials[1],
    facet2: facetMaterials[2],
    facet3: facetMaterials[3],
    facet4: facetMaterials[4],
    facet5: facetMaterials[5],
  };
}
