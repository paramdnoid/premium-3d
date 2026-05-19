import * as THREE from "three";

export type Point3 = [number, number, number];
export type Rotation3 = [number, number, number];

export const ARCHITECTURE_VIEW = {
  width: 1672,
  height: 864,
} as const;

export type ArchitectureGeometryKey =
  | "sourcePlane"
  | "backPlate"
  | "glassPanel"
  | "beamRail"
  | "lineRail"
  | "nodeCore";

export type ArchitectureGeometry = Record<ArchitectureGeometryKey, THREE.BufferGeometry>;

export type ArchitectureMaterialKey =
  | "source"
  | "backPlate"
  | "lowerPanel"
  | "rightPanel"
  | "topPanel"
  | "beam"
  | "hotLine"
  | "coolLine"
  | "goldLine"
  | "guideLine"
  | "node";

export type ArchitectureMaterials = Record<ArchitectureMaterialKey, THREE.Material>;

export function svgPointToWorld(x: number, y: number, z = 0): Point3 {
  return [x - ARCHITECTURE_VIEW.width / 2, ARCHITECTURE_VIEW.height / 2 - y, z];
}

function createGrainTexture(): THREE.DataTexture {
  const size = 96;
  const data = new Uint8Array(size * size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const noise = grain - Math.floor(grain);
      data[y * size + x] = Math.round(116 + noise * 70);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 10);
  texture.needsUpdate = true;
  return texture;
}

export function createArchitectureGeometry(): ArchitectureGeometry {
  const sourcePlane = new THREE.PlaneGeometry(
    ARCHITECTURE_VIEW.width,
    ARCHITECTURE_VIEW.height,
  );
  const backPlate = new THREE.BoxGeometry(
    ARCHITECTURE_VIEW.width,
    ARCHITECTURE_VIEW.height,
    26,
  );
  const glassPanel = new THREE.BoxGeometry(1, 1, 1);
  const beamRail = new THREE.BoxGeometry(1, 1, 1);
  const lineRail = new THREE.BoxGeometry(1, 1, 1);
  const nodeCore = new THREE.SphereGeometry(1, 24, 12);

  const geometry: ArchitectureGeometry = {
    sourcePlane,
    backPlate,
    glassPanel,
    beamRail,
    lineRail,
    nodeCore,
  };

  for (const geom of Object.values(geometry)) {
    geom.computeBoundingBox();
  }

  return geometry;
}

export function prepareSourceTexture(texture: THREE.Texture): THREE.Texture {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function createArchitectureMaterials(
  sourceTexture: THREE.Texture,
): ArchitectureMaterials {
  const grain = createGrainTexture();

  const glass = (color: string, emissive: string, opacity: number) =>
    new THREE.MeshPhysicalMaterial({
      color,
      emissive,
      emissiveIntensity: 0.08,
      metalness: 0.42,
      roughness: 0.34,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity,
      bumpMap: grain,
      bumpScale: 1.6,
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
      map: prepareSourceTexture(sourceTexture),
      toneMapped: false,
    }),
    backPlate: new THREE.MeshPhysicalMaterial({
      color: "#050506",
      emissive: "#090a0b",
      emissiveIntensity: 0.04,
      metalness: 0.72,
      roughness: 0.46,
      clearcoat: 0.5,
      clearcoatRoughness: 0.28,
      bumpMap: grain,
      bumpScale: 2.4,
    }),
    lowerPanel: glass("#111315", "#0a0b0c", 0.52),
    rightPanel: glass("#151719", "#191b1e", 0.56),
    topPanel: glass("#1a1b1c", "#1f2020", 0.62),
    beam: additive("#fff0cf", 0.72),
    hotLine: additive("#fff2d7", 0.72),
    coolLine: additive("#f7f2e8", 0.46),
    goldLine: additive("#f5b965", 0.44),
    guideLine: additive("#cfc8bc", 0.2),
    node: additive("#fff8ec", 0.82),
  };
}
