"use client";

import { createContext, useContext } from "react";
import type { RefObject } from "react";

/**
 * Live scroll state shared with the R3F render loop. Carried inside a ref so
 * the 3D scene can read it every frame without triggering React re-renders.
 */
export type ScrollState = {
  /** Normalised scroll progress through the whole page, 0..1. */
  progress: number;
  /** True when the visitor asked for reduced motion. */
  reduced: boolean;
};

export const ScrollContext = createContext<RefObject<ScrollState> | null>(null);

/** Reads the shared scroll-state ref. Must be used inside the provider. */
export function useScrollState(): RefObject<ScrollState> {
  const ctx = useContext(ScrollContext);

  if (!ctx) {
    throw new Error("useScrollState must be used within a <ScrollContext.Provider>");
  }

  return ctx;
}
