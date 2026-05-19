import * as THREE from "three";
import { createLogoGeometry, createLogoMaterials } from "./geometry";
import type { LogoGeometry, Point3 } from "./geometry";
import { PARTS } from "./parts";
import type { LineDef, PartDef } from "./parts";

/**
 * Stage 3B choreography. As the page scrolls the signet spins around its own
 * axis and sheds its 22 parts in five staggered batches — each batch flies off
 * the screen, leaving a clean landing page behind. Driven entirely by global
 * scroll progress (0..1); fully reversible.
 */

const BATCH_COUNT = 5;
/** Global progress at which the first batch begins to detach. */
const BATCH_FIRST = 0.07;
/** Progress gap between consecutive batch detachments. */
const BATCH_STEP = 0.02;
/** Duration (in progress) of a part's assembled -> detached flight. */
const DETACH_DURATION = 0.05;
/** Duration of a part's detached -> off-screen departure. */
const DEPART_DURATION = 0.1;
/** Within-batch stagger between parts. */
const STAGGER = 0.008;
/** Progress over which the spin builds — the disassembly window. */
const SPIN_RANGE = 0.38;
/** Turns the signet spins around its Y axis while it comes apart. */
const SPIN_TURNS = 2;

const DETACH_DISTANCE = 2.3;
const DEPART_DISTANCE = 9.5;

type Pose = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

type JourneyPartBase = {
  id: string;
  /** Home centre of the part in the assembled logo. */
  pivot: THREE.Vector3;
  /** Offset of the rendered content inside its pivot group. */
  meshOffset: Point3;
  /** Which of the five batches this part belongs to. */
  batch: number;
  /** Within-batch stagger delay. */
  delay: number;
  /** Flung-out intermediate pose. */
  detached: Pose;
  /** Final off-screen pose. */
  departed: Pose;
};

export type JourneyMeshPart = JourneyPartBase & {
  kind: "mesh";
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  homeScale: Point3;
};

export type JourneyLinesPart = JourneyPartBase & {
  kind: "lines";
  lines: LineDef[];
};

export type JourneyPart = JourneyMeshPart | JourneyLinesPart;

export type Journey = { parts: JourneyPart[] };

// --- Maths helpers ----------------------------------------------------------

function fract(value: number): number {
  return value - Math.floor(value);
}

function hash(index: number): [number, number, number] {
  return [
    fract(Math.sin((index + 1) * 12.9898) * 43758.5453),
    fract(Math.sin((index + 1) * 78.233) * 12543.1234),
    fract(Math.sin((index + 1) * 39.425) * 24634.6345),
  ];
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number): number {
  return t * t * t;
}

// --- Pose construction ------------------------------------------------------

function computePivot(def: PartDef, geometry: LogoGeometry): THREE.Vector3 {
  if (def.kind === "lines") {
    return new THREE.Vector3(...def.homePosition);
  }

  const center = new THREE.Vector3();
  geometry[def.geometry].boundingBox?.getCenter(center);
  const [sx, sy, sz] = def.homeScale;

  return new THREE.Vector3(
    def.homePosition[0] + center.x * sx,
    def.homePosition[1] + center.y * sy,
    def.homePosition[2] + center.z * sz,
  );
}

/** Outward direction a part travels when it detaches. */
function detachDirection(pivot: THREE.Vector3, index: number, total: number): THREE.Vector3 {
  const angle = (index / total) * Math.PI * 2;
  const fan = new THREE.Vector3(Math.cos(angle), Math.sin(angle) * 0.8, 0);
  const radial = pivot.clone();
  if (radial.lengthSq() > 1e-4) {
    radial.normalize();
  }

  const direction = new THREE.Vector3()
    .addScaledVector(radial, 0.55)
    .addScaledVector(fan, 0.65);
  direction.z += pivot.z >= 0 ? 0.5 : -0.5;
  if (direction.lengthSq() < 1e-4) {
    direction.set(Math.cos(angle), Math.sin(angle), 0.4);
  }
  return direction.normalize();
}

function tumbleQuaternion(index: number, strength: number): THREE.Quaternion {
  const [h0, h1, h2] = hash(index);
  return new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      (h0 - 0.5) * strength,
      (h1 - 0.5) * strength,
      (h2 - 0.5) * strength,
    ),
  );
}

/**
 * Builds the full journey: geometries, materials and the per-part
 * choreography. Call once and memoise — geometry construction is not cheap.
 */
export function buildJourney(): Journey {
  const geometry = createLogoGeometry();
  const materials = createLogoMaterials();
  const total = PARTS.length;

  // Detach batches follow the parts' assembly order.
  const order = [...PARTS]
    .map((def, index) => ({ index, order: def.order }))
    .sort((a, b) => a.order - b.order);
  const batchByIndex = new Map<number, { batch: number; rank: number }>();
  order.forEach((entry, rank) => {
    batchByIndex.set(entry.index, {
      batch: Math.floor((rank * BATCH_COUNT) / total),
      rank,
    });
  });

  const parts: JourneyPart[] = PARTS.map((def, index) => {
    const pivot = computePivot(def, geometry);
    const meshOffset: Point3 = [
      def.homePosition[0] - pivot.x,
      def.homePosition[1] - pivot.y,
      def.homePosition[2] - pivot.z,
    ];
    const { batch, rank } = batchByIndex.get(index) ?? { batch: 0, rank: 0 };
    const direction = detachDirection(pivot, index, total);

    const detached: Pose = {
      position: pivot.clone().addScaledVector(direction, DETACH_DISTANCE),
      quaternion: tumbleQuaternion(index, 2.4),
    };
    // Departure flies mostly outward (slight downward bias) to clear content fast.
    const departDir = direction.clone();
    departDir.y -= 0.25;
    departDir.normalize();
    const departed: Pose = {
      position: pivot.clone().addScaledVector(departDir, DEPART_DISTANCE),
      quaternion: tumbleQuaternion(index + 101, 5.2),
    };

    const base: JourneyPartBase = {
      id: def.id,
      pivot,
      meshOffset,
      batch,
      delay: (rank % Math.ceil(total / BATCH_COUNT)) * STAGGER,
      detached,
      departed,
    };

    if (def.kind === "lines") {
      return { ...base, kind: "lines", lines: def.lines };
    }
    return {
      ...base,
      kind: "mesh",
      geometry: geometry[def.geometry],
      material: materials[def.material],
      homeScale: def.homeScale,
    };
  });

  return { parts };
}

// --- Per-frame interpolation ------------------------------------------------

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const scratchAssembled = new THREE.Vector3();
const scratchSpin = new THREE.Quaternion();

/** Rotates a home position around the Y axis through the logo centre. */
function spunPosition(pivot: THREE.Vector3, angle: number, out: THREE.Vector3): void {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  out.set(pivot.x * cos - pivot.z * sin, pivot.y, pivot.x * sin + pivot.z * cos);
}

/**
 * Writes the pose for `progress` (0..1) straight onto `group`. Pure and
 * allocation-free. While assembled the part rides the spinning logo; once its
 * batch detaches it flies out and then off-screen. Reversible.
 */
export function applyPose(
  part: JourneyPart,
  progress: number,
  group: THREE.Object3D,
): void {
  const detachStart = BATCH_FIRST + part.batch * BATCH_STEP + part.delay;
  const detachEnd = detachStart + DETACH_DURATION;
  const departEnd = detachEnd + DEPART_DURATION;

  // The whole logo spins around its axis as it comes apart.
  const spin = clamp01(progress / SPIN_RANGE) * SPIN_TURNS * Math.PI * 2;
  spunPosition(part.pivot, spin, scratchAssembled);
  scratchSpin.setFromAxisAngle(Y_AXIS, spin);

  // Assembled — riding the spinning signet.
  if (progress <= detachStart) {
    group.position.copy(scratchAssembled);
    group.quaternion.copy(scratchSpin);
    group.scale.setScalar(1);
    return;
  }

  // Detaching — spinning home pose -> flung-out detached pose.
  if (progress < detachEnd) {
    const t = easeOutCubic((progress - detachStart) / DETACH_DURATION);
    group.position.lerpVectors(scratchAssembled, part.detached.position, t);
    group.quaternion.slerpQuaternions(scratchSpin, part.detached.quaternion, t);
    group.scale.setScalar(1);
    return;
  }

  // Departing — flung-out pose -> off-screen, shrinking away.
  if (progress < departEnd) {
    const t = easeInCubic((progress - detachEnd) / DEPART_DURATION);
    group.position.lerpVectors(part.detached.position, part.departed.position, t);
    group.quaternion.slerpQuaternions(
      part.detached.quaternion,
      part.departed.quaternion,
      t,
    );
    group.scale.setScalar(1 - t * 0.85);
    return;
  }

  // Gone.
  group.position.copy(part.departed.position);
  group.quaternion.copy(part.departed.quaternion);
  group.scale.setScalar(0.15);
}
