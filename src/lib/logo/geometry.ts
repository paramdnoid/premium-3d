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
  | "rivet"
  | "facet0"
  | "facet1"
  | "facet2"
  | "facet3"
  | "facet4"
  | "facet5";

export type LogoGeometry = Record<GeometryKey, THREE.BufferGeometry>;

/**
 * Builds every geometry of the signet. Ported verbatim from the original
 * `zian-logo-3d.tsx` so the assembled logo is pixel-identical. Bounding boxes
 * are pre-computed — the choreography uses them to find each part's pivot.
 */
export function createLogoGeometry(): LogoGeometry {
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
  const edge = new THREE.ExtrudeGeometry(createShape(outerPath), {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 8,
    bevelSize: 0.018,
    bevelThickness: 0.018,
    curveSegments: 12,
    steps: 1,
  });
  const rearPanel = new THREE.ShapeGeometry(createShape(outerPath));
  const rearInset = new THREE.ShapeGeometry(createShape(innerPath));
  const rearZ = new THREE.ShapeGeometry(createShape(rearZPath));
  const rivet = new THREE.SphereGeometry(0.018, 12, 12);

  shell.center();
  core.center();
  z.center();
  edge.center();

  const facets = frontFacets.map((facet) => new THREE.ShapeGeometry(createShape(facet.points)));

  const geometry: LogoGeometry = {
    shell,
    core,
    z,
    edge,
    rearPanel,
    rearInset,
    rearZ,
    rivet,
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
  | "zSide"
  | "rearPanel"
  | "rearInset"
  | "rearZ"
  | "rearRivet"
  | "rearShadow"
  | "rim"
  | "facet0"
  | "facet1"
  | "facet2"
  | "facet3"
  | "facet4"
  | "facet5";

export type LogoMaterials = Record<MaterialKey, THREE.Material>;

/** Builds every material of the signet, ported verbatim from the original. */
export function createLogoMaterials(): LogoMaterials {
  const facetMaterials = frontFacets.map(
    (facet) =>
      new THREE.MeshStandardMaterial({
        color: facet.color,
        metalness: 0.86,
        opacity: facet.opacity,
        roughness: facet.roughness,
        side: THREE.DoubleSide,
        transparent: true,
      }),
  );

  return {
    shell: new THREE.MeshStandardMaterial({
      color: "#050706",
      emissive: "#020403",
      emissiveIntensity: 0.035,
      metalness: 0.68,
      roughness: 0.52,
    }),
    core: new THREE.MeshStandardMaterial({
      color: "#030303",
      emissive: "#000000",
      emissiveIntensity: 0,
      metalness: 0,
      roughness: 1,
      transparent: true,
      opacity: 0.78,
    }),
    z: new THREE.MeshPhysicalMaterial({
      color: "#bfc1bb",
      emissive: "#989a94",
      emissiveIntensity: 0.18,
      metalness: 0.88,
      roughness: 0.24,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
      reflectivity: 0.58,
    }),
    zSide: new THREE.MeshStandardMaterial({
      color: "#22231f",
      emissive: "#050505",
      emissiveIntensity: 0.03,
      metalness: 0.82,
      roughness: 0.28,
    }),
    rearPanel: new THREE.MeshPhysicalMaterial({
      color: "#111511",
      emissive: "#070a07",
      emissiveIntensity: 0.08,
      metalness: 0.88,
      opacity: 0.92,
      roughness: 0.34,
      clearcoat: 0.42,
      clearcoatRoughness: 0.28,
      side: THREE.DoubleSide,
      transparent: true,
    }),
    rearInset: new THREE.MeshPhysicalMaterial({
      color: "#1b1f1a",
      emissive: "#0a0d0b",
      emissiveIntensity: 0.08,
      metalness: 0.9,
      opacity: 0.58,
      roughness: 0.26,
      clearcoat: 0.52,
      clearcoatRoughness: 0.22,
      side: THREE.DoubleSide,
      transparent: true,
    }),
    rearZ: new THREE.MeshStandardMaterial({
      color: "#d4d7cf",
      emissive: "#7f837b",
      emissiveIntensity: 0.12,
      metalness: 0.94,
      opacity: 0.18,
      roughness: 0.2,
      side: THREE.DoubleSide,
      transparent: true,
    }),
    rearRivet: new THREE.MeshBasicMaterial({
      color: "#dce1d7",
      opacity: 0.24,
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
      color: "#e8ebe3",
      emissive: "#f4f7ef",
      emissiveIntensity: 0.12,
      metalness: 1,
      opacity: 0.08,
      roughness: 0.2,
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
