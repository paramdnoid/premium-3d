import { svgPointToWorld } from "./geometry";
import type {
  ArchitectureGeometryKey,
  ArchitectureMaterialKey,
  Point3,
  Rotation3,
} from "./geometry";

export type MeshPartDef = {
  id: string;
  kind: "mesh";
  geometry: ArchitectureGeometryKey;
  material: ArchitectureMaterialKey;
  homePosition: Point3;
  homeRotation: Rotation3;
  homeScale: Point3;
  order: number;
};

export type LineDef = {
  id: string;
  a: [number, number];
  b: [number, number];
  material: ArchitectureMaterialKey;
  width: number;
  depth: number;
  z: number;
  order: number;
};

export type NodeDef = {
  id: string;
  x: number;
  y: number;
  radius: number;
  material: ArchitectureMaterialKey;
  z: number;
  order: number;
};

export type PartDef = MeshPartDef;

const NO_ROTATION: Rotation3 = [0, 0, 0];

function rectPart(
  id: string,
  geometry: ArchitectureGeometryKey,
  material: ArchitectureMaterialKey,
  x: number,
  y: number,
  width: number,
  height: number,
  depth: number,
  z: number,
  order: number,
): MeshPartDef {
  return {
    id,
    kind: "mesh",
    geometry,
    material,
    homePosition: svgPointToWorld(x + width / 2, y + height / 2, z),
    homeRotation: NO_ROTATION,
    homeScale: [width, height, depth],
    order,
  };
}

function segmentPart(def: LineDef): MeshPartDef {
  const [ax, ay] = def.a;
  const [bx, by] = def.b;
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(-dy, dx);

  return {
    id: def.id,
    kind: "mesh",
    geometry: "lineRail",
    material: def.material,
    homePosition: svgPointToWorld((ax + bx) / 2, (ay + by) / 2, def.z),
    homeRotation: [0, 0, angle],
    homeScale: [length, def.width, def.depth],
    order: def.order,
  };
}

function nodePart(def: NodeDef): MeshPartDef {
  return {
    id: def.id,
    kind: "mesh",
    geometry: "nodeCore",
    material: def.material,
    homePosition: svgPointToWorld(def.x, def.y, def.z),
    homeRotation: NO_ROTATION,
    homeScale: [def.radius, def.radius, def.radius * 0.46],
    order: def.order,
  };
}

const panels: MeshPartDef[] = [
  rectPart("architecture-back-plate", "backPlate", "backPlate", 0, 0, 1672, 864, 1, -22, 0),
  rectPart("lower-glass-panel", "glassPanel", "lowerPanel", 1011, 305, 303, 462, 18, -12, 4),
  rectPart("right-glass-panel", "glassPanel", "rightPanel", 1218, 343, 364, 425, 22, -9, 5),
  rectPart("top-glass-panel", "glassPanel", "topPanel", 1206, 58, 394, 285, 18, -6, 6),
];

const guideLines: LineDef[] = [
  { id: "top-panel-top", a: [1206, 58], b: [1600, 58], material: "guideLine", width: 1, depth: 3, z: -1, order: 8 },
  { id: "top-panel-right", a: [1600, 58], b: [1600, 343], material: "guideLine", width: 1, depth: 3, z: -1, order: 8 },
  { id: "top-panel-bottom", a: [1206, 343], b: [1600, 343], material: "guideLine", width: 1.2, depth: 3, z: -1, order: 8 },
  { id: "top-panel-left", a: [1206, 58], b: [1206, 343], material: "coolLine", width: 1.4, depth: 4, z: 0, order: 9 },
  { id: "right-panel-left", a: [1314, 343], b: [1314, 768], material: "guideLine", width: 1, depth: 3, z: -1, order: 8 },
  { id: "right-panel-inner", a: [1534, 281], b: [1534, 768], material: "guideLine", width: 1, depth: 3, z: -1, order: 8 },
  { id: "lower-panel-left", a: [1011, 305], b: [1011, 767], material: "guideLine", width: 1, depth: 3, z: -1, order: 8 },
  { id: "lower-panel-bottom", a: [1011, 767], b: [1314, 767], material: "guideLine", width: 1, depth: 3, z: -1, order: 8 },
  { id: "beam-core", a: [847, 769], b: [1208, 346], material: "beam", width: 4.2, depth: 5, z: 1, order: 11 },
  { id: "beam-edge", a: [1014, 586], b: [1211, 341], material: "beam", width: 2.1, depth: 5, z: 2, order: 12 },
  { id: "hot-horizontal", a: [963, 519], b: [1584, 519], material: "hotLine", width: 1.6, depth: 4, z: 1.5, order: 12 },
  { id: "top-cool-line", a: [1206, 282], b: [1601, 282], material: "coolLine", width: 1.4, depth: 4, z: 1.4, order: 12 },
  { id: "gold-mid-line", a: [864, 589], b: [1282, 589], material: "goldLine", width: 1.2, depth: 4, z: 1.4, order: 12 },
  { id: "gold-upper-line", a: [834, 180], b: [1115, 180], material: "goldLine", width: 1.2, depth: 4, z: 1.3, order: 12 },
];

const nodes: NodeDef[] = [
  { id: "node-hot-left", x: 963, y: 519, radius: 2.65, material: "node", z: 3, order: 13 },
  { id: "node-gold-lower", x: 1012, y: 589, radius: 2.1, material: "node", z: 3, order: 13 },
  { id: "node-top-left", x: 1206, y: 282, radius: 2.3, material: "node", z: 3, order: 13 },
  { id: "node-top-mid", x: 1534, y: 282, radius: 1.85, material: "node", z: 3, order: 13 },
  { id: "node-bottom", x: 1263, y: 766, radius: 1.65, material: "node", z: 3, order: 13 },
];

const exactSource: MeshPartDef = {
  id: "svg-source-surface",
  kind: "mesh",
  geometry: "sourcePlane",
  material: "source",
  homePosition: [0, 0, 8],
  homeRotation: NO_ROTATION,
  homeScale: [1, 1, 1],
  order: 20,
};

export const PARTS: PartDef[] = [
  ...panels,
  ...guideLines.map(segmentPart),
  ...nodes.map(nodePart),
  exactSource,
];
