import * as THREE from "three";
import { createArchitectureGeometry, createArchitectureMaterials } from "./geometry";
import type { ArchitectureGeometry, Point3, Rotation3 } from "./geometry";
import { PARTS } from "./parts";
import type { PartDef } from "./parts";

export type ArchitecturePart = {
  id: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  pivot: THREE.Vector3;
  meshOffset: Point3;
  homeRotation: Rotation3;
  homeScale: Point3;
  order: number;
};

export type ArchitectureElement = {
  parts: ArchitecturePart[];
};

function computePivot(def: PartDef, geometry: ArchitectureGeometry): THREE.Vector3 {
  const center = new THREE.Vector3();
  geometry[def.geometry].boundingBox?.getCenter(center);
  const [sx, sy, sz] = def.homeScale;

  return new THREE.Vector3(
    def.homePosition[0] + center.x * sx,
    def.homePosition[1] + center.y * sy,
    def.homePosition[2] + center.z * sz,
  );
}

export function buildArchitectureElement(sourceTexture: THREE.Texture): ArchitectureElement {
  const geometry = createArchitectureGeometry();
  const materials = createArchitectureMaterials(sourceTexture);

  const parts = [...PARTS]
    .sort((a, b) => a.order - b.order)
    .map((def) => {
      const pivot = computePivot(def, geometry);
      const meshOffset: Point3 = [
        def.homePosition[0] - pivot.x,
        def.homePosition[1] - pivot.y,
        def.homePosition[2] - pivot.z,
      ];

      return {
        id: def.id,
        geometry: geometry[def.geometry],
        material: materials[def.material],
        pivot,
        meshOffset,
        homeRotation: def.homeRotation,
        homeScale: def.homeScale,
        order: def.order,
      };
    });

  return { parts };
}
