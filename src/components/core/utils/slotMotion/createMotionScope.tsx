import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { resolveSlotPhase } from "./resolveMotionValue";
import { killStoredMotion, runMotionPhase, type RunMotionPhaseResult } from "./runMotionPhase";
import type { MotionPartPhases, MotionSlotMap, MotionValue } from "./slotMotionTypes";

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
  getParams: () => Record<string, unknown>;
  getTargets: () => Record<string, HTMLElement | null>;
  registerTarget: (slot: string, node: HTMLElement | null) => void;
  registerPartMotion: (slot: string, part: MotionPartPhases | undefined) => void;
  resolve: (
    slot: string,
    phase: string,
    partMotion?: MotionPartPhases,
  ) => MotionValue | undefined;
  play: (slot: string, phase: string, options?: PlaySlotPhaseOptions) => RunMotionPhaseResult;
  playBroadcast: (phase: string, options?: PlayBroadcastOptions) => Promise<void>;
};

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
    params?: Record<string, unknown>;
    children: ReactNode;
  }) {
    const targetsRef = useRef<Record<string, HTMLElement | null>>({});
    const partMotionRef = useRef<MotionSlotMap>({});
    const motionRef = useRef(motion);
    const defaultsRef = useRef(defaults);
    const paramsRef = useRef(params ?? {});
    motionRef.current = motion;
    defaultsRef.current = defaults;
    paramsRef.current = params ?? {};

    const registerTarget = useCallback((slot: string, node: HTMLElement | null) => {
      if (node) {
        targetsRef.current[slot] = node;
        return;
      }
      delete targetsRef.current[slot];
    }, []);

    const registerPartMotion = useCallback((slot: string, part: MotionPartPhases | undefined) => {
      if (part) {
        partMotionRef.current[slot] = part;
        return;
      }
      delete partMotionRef.current[slot];
    }, []);

    const resolve = useCallback(
      (slot: string, phase: string, partMotion?: MotionPartPhases) =>
        resolveSlotPhase(
          slot,
          phase,
          partMotion ?? partMotionRef.current[slot],
          motionRef.current,
          defaultsRef.current,
        ),
      [],
    );

    const play = useCallback(
      (slot: string, phase: string, options?: PlaySlotPhaseOptions): RunMotionPhaseResult => {
        const partMotion = options?.partMotion ?? partMotionRef.current[slot];
        const value = resolveSlotPhase(
          slot,
          phase,
          partMotion,
          motionRef.current,
          defaultsRef.current,
        );
        const resolvedValue = options?.partValue !== undefined ? options.partValue : value;
        const el = options?.el ?? targetsRef.current[slot] ?? null;
        return runMotionPhase({
          el,
          phase,
          value: resolvedValue,
          targets: targetsRef.current,
          params: paramsRef.current,
          complete: options?.complete,
          waitForComplete: options?.waitForComplete,
          slot,
        });
      },
      [],
    );

    const playBroadcast = useCallback(
      async (phase: string, options?: PlayBroadcastOptions) => {
        const exclude = new Set(options?.exclude ?? []);
        const slots = new Set([
          ...Object.keys(defaultsRef.current ?? {}),
          ...Object.keys(motionRef.current ?? {}),
          ...Object.keys(targetsRef.current),
          ...Object.keys(options?.extraPartMotion ?? {}),
        ]);
        const results: RunMotionPhaseResult[] = [];
        for (const slot of slots) {
          if (exclude.has(slot)) continue;
          const partMotion = options?.extraPartMotion?.[slot] ?? partMotionRef.current[slot];
          const value = resolveSlotPhase(
            slot,
            phase,
            partMotion,
            motionRef.current,
            defaultsRef.current,
          );
          if (value === undefined || value === false) continue;
          const el = targetsRef.current[slot];
          if (!el) continue;
          results.push(
            play(slot, phase, {
              partMotion,
              el,
              waitForComplete: options?.waitForComplete,
            }),
          );
        }
        if (options?.waitForComplete) {
          await Promise.all(results.map((r) => r.finished));
        }
        options?.complete?.();
      },
      [play],
    );

    const value = useMemo<MotionScopeValue>(
      () => ({
        getRootMotion: () => motionRef.current,
        getDefaults: () => defaultsRef.current,
        getParams: () => paramsRef.current,
        getTargets: () => targetsRef.current,
        registerTarget,
        registerPartMotion,
        resolve,
        play,
        playBroadcast,
      }),
      [play, playBroadcast, registerPartMotion, registerTarget, resolve],
    );

    return (
      <MotionScopeContext.Provider value={value}>{children}</MotionScopeContext.Provider>
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

export function killMotionTargets(targets: Record<string, HTMLElement | null>): void {
  for (const el of Object.values(targets)) {
    if (el) killStoredMotion(el);
  }
}
