import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

import {
  getMotionConfig,
  getMotionConfigRevision,
  overlayMotionConfig,
  subscribeMotionConfig,
  type MotionConfig,
} from "./motionConfig";

const MotionConfigContext = createContext<MotionConfig | null>(null);

export type MotionConfigProviderProps = {
  /**
   * Overlay on the parent scope (or the global `configureMotion` default).
   * Unspecified keys inherit. Empty / invalid overlay is a no-op.
   */
  motion?: Partial<MotionConfig> | null;
  children: ReactNode;
};

/**
 * Scoped GSAP motion config for a React tree (including portals).
 * `BurneUIProvider` wraps the app with this. Use it directly to overlay
 * timings/flags on an island without a second theme root.
 */
export function MotionConfigProvider({ motion, children }: MotionConfigProviderProps) {
  const parent = useContext(MotionConfigContext);
  const revision = useSyncExternalStore(
    subscribeMotionConfig,
    getMotionConfigRevision,
    getMotionConfigRevision,
  );
  const value = useMemo(() => {
    const base = parent ?? getMotionConfig();
    return overlayMotionConfig(base, motion);
  }, [parent, motion, revision]);

  return (
    <MotionConfigContext.Provider value={value}>{children}</MotionConfigContext.Provider>
  );
}

/**
 * Resolved motion config for the current tree: provider overlay, else global
 * `configureMotion()` default. Subscribes to global revision so unspecified
 * keys follow `configureMotion()` on the **next** play (running slot phases
 * keep their snapshot). Looping React effects that depend on this hook rebuild.
 */
export function useMotionConfig(): Readonly<MotionConfig> {
  const scoped = useContext(MotionConfigContext);
  const revision = useSyncExternalStore(
    subscribeMotionConfig,
    getMotionConfigRevision,
    getMotionConfigRevision,
  );
  if (scoped) return scoped;
  void revision;
  return getMotionConfig();
}
