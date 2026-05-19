"use client";

import { OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

/** Apparent height of the assembled logo in world units (LOGO_SCALE included). */
const LOGO_WORLD_HEIGHT = 3.5;

/**
 * Drives the orthographic camera's zoom from the viewport so the assembled
 * logo keeps a constant apparent size on any screen. The original `zoom: 96`
 * was calibrated for a fixed 440px canvas; the journey runs full-viewport.
 */
export function ResponsiveCamera() {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);

  const fraction = width < 640 ? 0.3 : 0.46;
  const zoom = Math.min(260, Math.max(56, (fraction * height) / LOGO_WORLD_HEIGHT));

  return (
    <OrthographicCamera makeDefault position={[0, 0, 7]} zoom={zoom} near={0.1} far={100} />
  );
}
