import { createContext, useContext, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
 
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
import { createSlotMounts, settledMountRun } from "./slotMount";
import { enterHidesFirstPaint } from "./enterHidesFirstPaint";
import {
  attachMotionController,
  createMotionControllerFromScope,
  MotionControllerProvider,
} from "./motionController";
import type { MotionController } from "./motionControllerTypes";
import {
  splitMotionRootMap,
  type MotionEvents,
  type MotionRootInput,
  type MotionStates,
} from "./motionEvents";
import { useMotionStatePlayback } from "./playMotionState";
import {
  isMotionPhaseName,
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
  fromState?: string;
  toState?: string;
  payload?: unknown;
  /** Overlay for this run. Host-measured recipe inputs (FLIP, stack peek). */
  params?: MotionRecipeParams;
};
 
export type PlayBroadcastOptions = {
  waitForComplete?: boolean;
  complete?: () => void;
  exclude?: string[];
  extraPartMotion?: MotionSlotMap;
};
 
export type MotionScopeValue = {
  getRootMotion: () => MotionSlotMap | undefined;
  getEvents: () => MotionEvents | undefined;
  getStates: () => MotionStates | undefined;
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
  play: (slot: string, name: string, options?: PlaySlotPhaseOptions) => MotionRun;
  playBroadcast: (phase: MotionPhaseName, options?: PlayBroadcastOptions) => Promise<void>;
  /** Re-read `mount` on every live registration. Same value does not rebind. */
  syncMounts: () => void;
  /** Bound controller for this scope (`createMotionControllerFromScope`). */
  controller: MotionController;
};
 
export type CreateMotionScopeControllerOptions = {
  getRootMotion: () => MotionRootInput | undefined;
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
  const getSlots = () => splitMotionRootMap(getRootMotion()).slots;
  const getEvents = () => splitMotionRootMap(getRootMotion()).events;
  const getStates = () => splitMotionRootMap(getRootMotion()).states;
 
  const mounts = createSlotMounts({
    resolve: (slot, partMotion) => resolveSlotPhase(slot, "mount", partMotion, getSlots(), getDefaults()),
    getParams,
    getConfig,
    getTarget: registry.getTarget,
    getTargets: registry.getTargets,
  });

  const register = (input: MotionRegisterInput) => {
    const dispose = registry.register(input);
    if (input.id) {
      if (!input.node) mounts.release(input.id);
      else {
        const reg = registry.find(input.slot, input.node);
        if (reg) mounts.sync(reg);
      }
    }
    return () => {
      dispose();
      if (input.id) mounts.release(input.id);
    };
  };
 
  const registerTarget = (slot: string, node: HTMLElement | null) => {
    let id = hostIds.get(slot);
    if (!id) {
      id = Symbol(`host:${slot}`);
      hostIds.set(slot, id);
    }
    register({ id, slot, node });
  };
 
  const resolve = (slot: string, phase: MotionPhaseName, partMotion?: MotionPartPhases) =>
    resolveSlotPhase(slot, phase, partMotion, getSlots(), getDefaults());
 
  const play = (
    slot: string,
    name: string,
    options?: PlaySlotPhaseOptions,
  ): MotionRun => {
    if (name === "mount") {
      const el = options?.el ?? registry.getTarget(slot);
      const reg = registry.find(slot, el);
      if (reg) mounts.sync(reg);
      return settledMountRun();
    }
    const el = options?.el ?? registry.getTarget(slot);
    const reg = registry.find(slot, el);
    const partMotion = options?.partMotion ?? reg?.motion;
    let resolvedValue: MotionValue | undefined;
    if (options?.partValue !== undefined) {
      resolvedValue = options.partValue;
    } else if (isMotionPhaseName(name)) {
      resolvedValue = resolveSlotPhase(slot, name, partMotion, getSlots(), getDefaults());
    } else {
      resolvedValue = getEvents()?.[name];
    }
    const sharedParams = options?.params ? { ...getParams(), ...options.params } : getParams();
    const hoverInOff =
      name === "pressIn" &&
      resolveSlotPhase(slot, "hoverIn", partMotion, getSlots(), getDefaults()) === false;
    return runMotionPhase({
      el,
      phase: name,
      value: resolvedValue,
      targets: registry.snapshotTargets(),
      getTarget: registry.getTarget,
      getTargets: registry.getTargets,
      params: hoverInOff ? { ...sharedParams, restoreHover: false } : sharedParams,
      complete: options?.complete,
      waitForComplete: options?.waitForComplete,
      slot,
      config: getConfig?.(),
      fromState: options?.fromState,
      toState: options?.toState,
      payload: options?.payload,
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
        getSlots(),
        getDefaults(),
      );
      if (value === undefined || value === false) continue;
      if (!registry.find(chosen.slot, chosen.node)) continue;
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
 
  const scope: MotionScopeValue = {
    getRootMotion: getSlots,
    getEvents,
    getStates,
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
    syncMounts: () => {
      for (const reg of registry.getRegistrations()) mounts.sync(reg);
    },
    controller: null as unknown as MotionController,
  };
  scope.controller = createMotionControllerFromScope(scope);
  return scope;
}
 
export function createMotionScope(debugName: string) {
  const MotionScopeContext = createContext<MotionScopeValue | null>(null);
 
  function MotionScopeProvider({
    motion,
    defaults,
    params,
    controller: appController,
    motionState,
    motionPayload,
    playInitialState = false,
    children,
  }: {
    motion?: MotionRootInput;
    defaults?: MotionSlotMap;
    params?: MotionRecipeParams;
    /** Deferred handle from `createMotionController()` — attach for the Provider lifetime. */
    controller?: MotionController;
    motionState?: string;
    /** App snapshot for `ctx.payload` — not kit `params`. */
    motionPayload?: unknown;
    playInitialState?: boolean;
    children: ReactNode;
  }) {
    const motionRef = useRef(motion);
    const defaultsRef = useRef(defaults);
    const paramsRef = useRef<MotionRecipeParams>(params ?? {});
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
    motionRef.current = motion;
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
    defaultsRef.current = defaults;
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
    paramsRef.current = params ?? {};
 
    const config = useMotionConfig();
    const configRef = useRef(config);
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
    configRef.current = config;
 
    const scope = useMemo(
      () =>
        createMotionScopeController({
          getRootMotion: () => motionRef.current,
          getDefaults: () => defaultsRef.current,
          getParams: () => paramsRef.current,
          getConfig: () => configRef.current,
        }),
      [],
    );
 
    useLayoutEffect(() => {
      if (!appController) return;
      attachMotionController(appController, scope);
      return () => attachMotionController(appController, null);
    }, [appController, scope]);
 
    useMotionStatePlayback(scope, motionState, motionPayload, playInitialState);

    useLayoutEffect(() => {
      scope.syncMounts();
    }, [defaults, motion, scope]);
 
    return (
      <MotionScopeContext.Provider value={scope}>
        <MotionControllerProvider controller={appController ?? scope.controller}>
          {children}
        </MotionControllerProvider>
      </MotionScopeContext.Provider>
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
 