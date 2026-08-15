import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";

import { gsap } from "@/components/core/utils/gsapMotion";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import type { MotionConfig } from "@/components/core/utils/motionConfig";

import {
  createMotionRegistry,
  type MotionRegisterInput,
  type MotionRegistration,
  type MotionRegistry,
} from "./createMotionRegistry";
import { resolveSlotPhase } from "./resolveMotionValue";
import { killStoredMotion, runMotionPhase } from "./runMotionPhase";
import { enterHidesFirstPaint } from "./enterHidesFirstPaint";
import {
  type MotionPartPhases,
  type MotionPhaseName,
  type MotionRecipeParams,
  type MotionRun,
  type MotionSlotMap,
  type MotionValue,
} from "./slotMotionTypes";

export type { MotionRegisterInput, MotionRegistration, MotionRegistry } from "./createMotionRegistry";
export { createMotionRegistry } from "./createMotionRegistry";

export type PlaySlotPhaseOptions = {
  partValue?: MotionValue;
  partMotion?: MotionPartPhases;
  el?: HTMLElement | null;
  waitForComplete?: boolean;
  complete?: () => void;
};

export type PlayBroadcastOptions = {
  waitForComplete?: boolean;
  complete?: () => void;
  exclude?: string[];
  extraPartMotion?: MotionSlotMap;
};

export type MotionScopeValue = {
  getRootMotion: () => MotionSlotMap | undefined;
  getDefaults: () => MotionSlotMap | undefined;
  getParams: () => MotionRecipeParams;
  /** Unique / first live instance of a slot. Repeated slots: `getTargets(slot)`. */
  getTarget: (slot: string) => HTMLElement | null;
  /** All live DOM instances of a slot (deduped by node). */
  getTargets: (slot: string) => readonly HTMLElement[];
  getRegistrations: (slot?: string) => readonly MotionRegistration[];
  /**
   * Unique host upsert (one registration per slot name). Parts use `register`
   * with a stable instance id — do not share this with repeated siblings.
   */
  registerTarget: (slot: string, node: HTMLElement | null) => void;
  /** Instance-scoped upsert. Disposer removes only this `id`. */
  register: (input: MotionRegisterInput) => () => void;
  resolve: (
    slot: string,
    phase: MotionPhaseName,
    partMotion?: MotionPartPhases,
  ) => MotionValue | undefined;
  play: (slot: string, phase: MotionPhaseName, options?: PlaySlotPhaseOptions) => MotionRun;
  playBroadcast: (phase: MotionPhaseName, options?: PlayBroadcastOptions) => Promise<void>;
};

export type CreateMotionScopeControllerOptions = {
  getRootMotion: () => MotionSlotMap | undefined;
  getDefaults: () => MotionSlotMap | undefined;
  getParams: () => MotionRecipeParams;
  getConfig?: () => Readonly<MotionConfig>;
  registry?: MotionRegistry;
};

/**
 * Scope methods without React. Provider holds refs and passes getters here.
 */
export function createMotionScopeController({
  getRootMotion,
  getDefaults,
  getParams,
  getConfig,
  registry = createMotionRegistry(),
}: CreateMotionScopeControllerOptions): MotionScopeValue {
  const hostIds = new Map<string, symbol>();

  const register = (input: MotionRegisterInput) => registry.register(input);

  const registerTarget = (slot: string, node: HTMLElement | null) => {
    let id = hostIds.get(slot);
    if (!id) {
      id = Symbol(`host:${slot}`);
      hostIds.set(slot, id);
    }
    register({ id, slot, node });
  };

  const resolve = (slot: string, phase: MotionPhaseName, partMotion?: MotionPartPhases) =>
    resolveSlotPhase(slot, phase, partMotion, getRootMotion(), getDefaults());

  const play = (
    slot: string,
    phase: MotionPhaseName,
    options?: PlaySlotPhaseOptions,
  ): MotionRun => {
    const el = options?.el ?? registry.getTarget(slot);
    const reg = registry.find(slot, el);
    const partMotion = options?.partMotion ?? reg?.motion;
    const value = resolveSlotPhase(slot, phase, partMotion, getRootMotion(), getDefaults());
    const resolvedValue = options?.partValue !== undefined ? options.partValue : value;
    return runMotionPhase({
      el,
      phase,
      value: resolvedValue,
      targets: registry.snapshotTargets(),
      getTarget: registry.getTarget,
      getTargets: registry.getTargets,
      params: getParams(),
      complete: options?.complete,
      waitForComplete: options?.waitForComplete,
      slot,
      config: getConfig?.(),
    });
  };

  const playBroadcast = async (phase: MotionPhaseName, options?: PlayBroadcastOptions) => {
    const exclude = new Set(options?.exclude ?? []);
    const extra = options?.extraPartMotion;
    const byNode = new Map<HTMLElement, MotionRegistration[]>();
    for (const reg of registry.getRegistrations()) {
      if (exclude.has(reg.slot)) continue;
      const list = byNode.get(reg.node);
      if (list) list.push(reg);
      else byNode.set(reg.node, [reg]);
    }
    const results: MotionRun[] = [];
    for (const regs of byNode.values()) {
      const chosen =
        [...regs].reverse().find((reg) => reg.motion != null) ?? regs[regs.length - 1];
      const partMotion = extra?.[chosen.slot] ?? chosen.motion;
      const value = resolveSlotPhase(
        chosen.slot,
        phase,
        partMotion,
        getRootMotion(),
        getDefaults(),
      );
      if (value === undefined || value === false) continue;
      results.push(
        play(chosen.slot, phase, {
          partMotion,
          el: chosen.node,
          waitForComplete: options?.waitForComplete,
        }),
      );
    }
    if (options?.waitForComplete) {
      await Promise.all(results.map((r) => r.finished));
    }
    options?.complete?.();
  };

  return {
    getRootMotion,
    getDefaults,
    getParams,
    getTarget: registry.getTarget,
    getTargets: registry.getTargets,
    getRegistrations: registry.getRegistrations,
    registerTarget,
    register,
    resolve,
    play,
    playBroadcast,
  };
}

export function createMotionScope(debugName: string) {
  const MotionScopeContext = createContext<MotionScopeValue | null>(null);

  function MotionScopeProvider({
    motion,
    defaults,
    params,
    children,
  }: {
    motion?: MotionSlotMap;
    defaults?: MotionSlotMap;
    params?: MotionRecipeParams;
    children: ReactNode;
  }) {
    const motionRef = useRef(motion);
    const defaultsRef = useRef(defaults);
    const paramsRef = useRef<MotionRecipeParams>(params ?? {});
    motionRef.current = motion;
    defaultsRef.current = defaults;
    paramsRef.current = params ?? {};

    const config = useMotionConfig();
    const configRef = useRef(config);
    configRef.current = config;

    const controller = useMemo(
      () =>
        createMotionScopeController({
          getRootMotion: () => motionRef.current,
          getDefaults: () => defaultsRef.current,
          getParams: () => paramsRef.current,
          getConfig: () => configRef.current,
        }),
      [],
    );

    return (
      <MotionScopeContext.Provider value={controller}>{children}</MotionScopeContext.Provider>
    );
  }

  function useMotionScope(): MotionScopeValue {
    const ctx = useContext(MotionScopeContext);
    if (!ctx) {
      throw new Error(`${debugName} motion parts must be used inside the motion scope.`);
    }
    return ctx;
  }

  function useOptionalMotionScope(): MotionScopeValue | null {
    return useContext(MotionScopeContext);
  }

  return {
    MotionScopeProvider,
    useMotionScope,
    useOptionalMotionScope,
  };
}

export function killMotionScope(scope: Pick<MotionScopeValue, "getRegistrations">): void {
  const seen = new Set<HTMLElement>();
  for (const reg of scope.getRegistrations()) {
    if (seen.has(reg.node)) continue;
    seen.add(reg.node);
    killStoredMotion(reg.node);
  }
}

/** Hide nested enter slots that start hidden so they do not FOUC. */
export function hideNestedEnterSlots(
  scope: MotionScopeValue,
  exclude: readonly string[],
): void {
  const skip = new Set(exclude);
  const seen = new Set<HTMLElement>();
  for (const reg of scope.getRegistrations()) {
    if (skip.has(reg.slot)) continue;
    if (seen.has(reg.node)) continue;
    seen.add(reg.node);
    if (!enterHidesFirstPaint(scope.resolve(reg.slot, "enter", reg.motion))) continue;
    gsap.set(reg.node, { autoAlpha: 0, force3D: false });
  }
}
