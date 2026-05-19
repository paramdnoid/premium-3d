import { closeLine, innerPath, outerPath } from "./geometry";
import type { GeometryKey, MaterialKey, Point3 } from "./geometry";

/** Uniform scale of the whole signet, ported from the original group. */
export const LOGO_SCALE = 1.06;

/** A single solid mesh of the signet. */
export type MeshPartDef = {
  id: string;
  kind: "mesh";
  geometry: GeometryKey;
  material: MaterialKey;
  /** Exact position the mesh has in the assembled logo. */
  homePosition: Point3;
  /** Exact scale the mesh has in the assembled logo. */
  homeScale: Point3;
  /** Lower values detach earlier during disassembly. */
  order: number;
};

/** One wireframe line. */
export type LineDef = {
  points: Point3[];
  color: string;
  lineWidth: number;
  opacity: number;
  dashed: boolean;
  dashSize?: number;
  gapSize?: number;
};

/** The whole wireframe cage, choreographed as one rigid unit. */
export type LinesPartDef = {
  id: string;
  kind: "lines";
  lines: LineDef[];
  homePosition: Point3;
  homeScale: Point3;
  order: number;
};

export type PartDef = MeshPartDef | LinesPartDef;

const NO_SCALE: Point3 = [1, 1, 1];

// --- Structural meshes ------------------------------------------------------
const structuralParts: MeshPartDef[] = [
  {
    id: "rear-z",
    kind: "mesh",
    geometry: "rearZ",
    material: "rearZ",
    homePosition: [0, 0.04, -0.672],
    homeScale: [0.72, 0.72, 0.72],
    order: 6,
  },
  {
    id: "rear-inset",
    kind: "mesh",
    geometry: "rearInset",
    material: "rearInset",
    homePosition: [0, 0, -0.645],
    homeScale: [0.9, 0.9, 0.9],
    order: 7,
  },
  {
    id: "rear-panel",
    kind: "mesh",
    geometry: "rearPanel",
    material: "rearPanel",
    homePosition: [0, 0, -0.62],
    homeScale: [0.96, 0.96, 0.96],
    order: 8,
  },
  {
    id: "rear-shadow",
    kind: "mesh",
    geometry: "edge",
    material: "rearShadow",
    homePosition: [0.04, -0.05, -0.5],
    homeScale: [0.96, 0.96, 1.7],
    order: 9,
  },
  {
    id: "shell",
    kind: "mesh",
    geometry: "shell",
    material: "shell",
    homePosition: [0, 0, -0.15],
    homeScale: NO_SCALE,
    order: 16,
  },
  {
    id: "core",
    kind: "mesh",
    geometry: "core",
    material: "core",
    homePosition: [0, 0, 0.23],
    homeScale: [0.98, 0.98, 1],
    order: 15,
  },
  {
    id: "rim",
    kind: "mesh",
    geometry: "edge",
    material: "rim",
    homePosition: [0, 0, 0.31],
    homeScale: [1.012, 1.012, 1],
    order: 17,
  },
  {
    id: "z-main",
    kind: "mesh",
    geometry: "z",
    material: "z",
    homePosition: [0, 0.12, 0.52],
    homeScale: NO_SCALE,
    order: 19,
  },
];

// --- Front facets -----------------------------------------------------------
const facetParts: MeshPartDef[] = [0, 1, 2, 3, 4, 5].map((index) => ({
  id: `facet-${index}`,
  kind: "mesh",
  geometry: `facet${index}` as GeometryKey,
  material: `facet${index}` as MaterialKey,
  homePosition: [0, 0, 0.16],
  homeScale: NO_SCALE,
  order: 10 + index,
}));

// --- Raised cinematic detail layers -----------------------------------------
const detailParts: MeshPartDef[] = [
  {
    id: "outer-rails",
    kind: "mesh",
    geometry: "outerRails",
    material: "outerRail",
    homePosition: [0, 0, 0.655],
    homeScale: NO_SCALE,
    order: 13,
  },
  {
    id: "inner-rails",
    kind: "mesh",
    geometry: "innerRails",
    material: "innerRail",
    homePosition: [0, 0, 0.682],
    homeScale: NO_SCALE,
    order: 14,
  },
  {
    id: "z-inlays",
    kind: "mesh",
    geometry: "zInlays",
    material: "zInset",
    homePosition: [0, 0.12, 0.642],
    homeScale: NO_SCALE,
    order: 18,
  },
];

// --- Wireframe cage ---------------------------------------------------------
const depthRibs: LineDef[] = outerPath.map(([x, y]) => ({
  points: [
    [x, y, -0.66],
    [x, y, 0.58],
  ],
  color: "#c8ccc3",
  lineWidth: 0.44,
  opacity: 0.18,
  dashed: false,
}));

const wireframeLines: LineDef[] = [
  { points: closeLine(outerPath, 0.63), color: "#f1f4eb", lineWidth: 1.75, opacity: 0.68, dashed: false },
  {
    points: closeLine(innerPath, 0.66),
    color: "#dce1d7",
    lineWidth: 0.9,
    opacity: 0.26,
    dashed: true,
    dashSize: 0.055,
    gapSize: 0.05,
  },
  { points: closeLine(outerPath, -0.7), color: "#dce1d7", lineWidth: 1.2, opacity: 0.42, dashed: false },
  {
    points: closeLine(innerPath, -0.72),
    color: "#aeb4aa",
    lineWidth: 0.65,
    opacity: 0.18,
    dashed: true,
    dashSize: 0.065,
    gapSize: 0.055,
  },
  ...depthRibs,
  {
    points: [
      [0, 1.22, 0.67],
      [0, 0.78, 0.67],
      [0, -1.12, 0.67],
    ],
    color: "#dce1d7",
    lineWidth: 0.62,
    opacity: 0.26,
    dashed: false,
  },
  {
    points: [
      [-0.68, 0.55, 0.68],
      [0.67, 0.55, 0.68],
    ],
    color: "#e9ece4",
    lineWidth: 0.72,
    opacity: 0.32,
    dashed: false,
  },
  {
    points: [
      [-0.68, -0.49, 0.68],
      [0.68, -0.49, 0.68],
    ],
    color: "#dce1d7",
    lineWidth: 0.72,
    opacity: 0.26,
    dashed: false,
  },
  {
    points: [
      [-0.58, -0.42, 0.69],
      [0.5, 0.28, 0.69],
    ],
    color: "#e9ece4",
    lineWidth: 0.56,
    opacity: 0.28,
    dashed: false,
  },
  {
    points: [
      [0, 1.1, -0.735],
      [0, -1.1, -0.735],
    ],
    color: "#cfd4cc",
    lineWidth: 0.52,
    opacity: 0.22,
    dashed: false,
  },
  {
    points: [
      [-0.58, -0.36, -0.74],
      [0.58, 0.36, -0.74],
    ],
    color: "#e3e6dd",
    lineWidth: 0.5,
    opacity: 0.2,
    dashed: false,
  },
  {
    points: [
      [-0.52, -0.58, -0.745],
      [0.52, -0.58, -0.745],
    ],
    color: "#cfd4cc",
    lineWidth: 0.48,
    opacity: 0.18,
    dashed: false,
  },
];

const wireframePart: LinesPartDef = {
  id: "wireframe",
  kind: "lines",
  lines: wireframeLines,
  homePosition: [0, 0, 0],
  homeScale: NO_SCALE,
  order: 12,
};

/** Every choreographable part of the signet. */
export const PARTS: PartDef[] = [
  ...structuralParts,
  ...facetParts,
  ...detailParts,
  wireframePart,
];
