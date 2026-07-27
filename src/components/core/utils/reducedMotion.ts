/**
 * OS `prefers-reduced-motion` — shared by all Burne UI GSAP paths
 * (not hover-lift specific).
 */

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_MQL = "(prefers-reduced-motion: reduce)";

function getReducedMotionMql(): MediaQueryList | null {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  return window.matchMedia(REDUCED_MOTION_MQL);
}

/** Sync read of `prefers-reduced-motion: reduce` (event handlers, non-React). */
export function prefersReducedMotion(): boolean {
  return getReducedMotionMql()?.matches ?? false;
}

function subscribePrefersReducedMotion(onStoreChange: () => void): () => void {
  const mql = getReducedMotionMql();
  if (!mql) return () => {};

  const listener = () => onStoreChange();
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}

function getPrefersReducedMotionSnapshot(): boolean {
  return prefersReducedMotion();
}

function getPrefersReducedMotionServerSnapshot(): boolean {
  return false;
}

/**
 * Reactive `prefers-reduced-motion` for React render / hook bodies.
 * Re-renders when the OS setting changes.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot,
  );
}
