import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
 
import { gsap } from "@/components/core/utils/gsapMotion";
 
import type { MotionController } from "./motionControllerTypes";
import type {
  MotionGroup,
  MotionGroupPlayAllOptions,
  MotionGroupTimeline,
  MotionGroupTimelinePlayAllOptions,
  MotionGroupTimelinePlayOptions,
} from "./motionGroupTypes";
import type {
  MotionCancelReason,
  MotionRun,
  MotionRunStatus,
  MotionTimelinePosition,
  MotionTransformVars,
} from "./slotMotionTypes";
 
let idleRunId = 0;
 
function warnDev(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[burne-ui] MotionGroup: ${message}`);
  }
}
 
function settledRun(status: MotionRunStatus): MotionRun {
  return {
    id: --idleRunId,
    phase: "",
    status,
    finished: Promise.resolve(),
    animation: undefined,
    cancel() {},
    cleanup() {},
    isCurrent: () => false,
  };
}
 
function waitMs(ms: number, signal?: AbortSignal): Promise<boolean> {
  if (!(ms > 0)) return Promise.resolve(!signal?.aborted);
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(false);
      return;
    }
    const id = globalThis.setTimeout(() => resolve(!signal?.aborted), ms);
    signal?.addEventListener(
      "abort",
      () => {
        globalThis.clearTimeout(id);
        resolve(false);
      },
      { once: true },
    );
  });
}
 
function createBoundGroup(): MotionGroup {
  const members = new Map<string, MotionController<string>>();
  let generation = 0;
  let activeGsap: gsap.core.Timeline | null = null;
 
  const bumpGeneration = () => {
    generation += 1;
    if (activeGsap) {
      activeGsap.kill();
      activeGsap = null;
    }
  };
 
  const resolveMember = (id: string, action: string): MotionController<string> | null => {
    if (!id) {
      warnDev(`empty member id (${action})`);
      return null;
    }
    const controller = members.get(id);
    if (!controller) {
      warnDev(`missing member "${id}"`);
      return null;
    }
    return controller;
  };
 
  const playMember: MotionGroup["play"] = (id, event, options) => {
    const controller = resolveMember(id, "play");
    if (!controller) return settledRun("cancelled");
    return controller.play(event, options);
  };
 
  const playSlotMember: MotionGroup["playSlot"] = (id, slot, event, options) => {
    const controller = resolveMember(id, "playSlot");
    if (!controller) return settledRun("cancelled");
    return controller.playSlot(slot, event, options);
  };
 
  const setMember = (id: string, slot: string, vars: MotionTransformVars): void => {
    const controller = resolveMember(id, "set");
    if (!controller) return;
    controller.set(slot, vars);
  };
 
  const playAllMembers = async (
    event: Parameters<MotionGroup["playAll"]>[0],
    options: MotionGroupPlayAllOptions | undefined,
    gen: number,
    acc?: MotionRun[],
  ): Promise<{ runs: MotionRun[] }> => {
    const staggerSec = options?.stagger;
    const staggerMs =
      staggerSec != null && Number.isFinite(staggerSec) && staggerSec > 0 ? staggerSec * 1000 : 0;
    if (staggerSec != null && !(Number.isFinite(staggerSec) && staggerSec >= 0)) {
      warnDev(`stagger=${String(staggerSec)} ignored (need a finite number ≥ 0, seconds)`);
    }
 
    const requested = options?.members;
    const ids = requested
      ? requested.filter((id) => {
          if (!id) {
            warnDev("empty member id (playAll)");
            return false;
          }
          if (!members.has(id)) {
            warnDev(`missing member "${id}"`);
            return false;
          }
          return true;
        })
      : [...members.keys()];
 
    const runs: MotionRun[] = [];
    let index = 0;
    for (const id of ids) {
      if (generation !== gen || options?.signal?.aborted) break;
      if (!members.has(id)) {
        index += 1;
        continue;
      }
      if (staggerMs > 0 && index > 0) {
        const ok = await waitMs(staggerMs, options?.signal);
        if (!ok || generation !== gen) break;
        if (!members.has(id)) {
          index += 1;
          continue;
        }
      }
      const run = playMember(id, event, { slot: options?.slot, signal: options?.signal });
      runs.push(run);
      acc?.push(run);
      index += 1;
    }
 
    if (options?.waitForComplete) {
      await Promise.all(runs.map((run) => run.finished));
    }
    return { runs };
  };
 
  const register: MotionGroup["register"] = (id, controller) => {
    if (!id) {
      warnDev("empty member id (register)");
      return () => {};
    }
    const previous = members.get(id);
    if (previous && previous !== controller) {
      warnDev(`replacing member "${id}"`);
    }
    for (const [existingId, existing] of members) {
      if (existing === controller && existingId !== id) {
        warnDev(`controller already registered as "${existingId}" (also "${id}")`);
      }
    }
    members.set(id, controller);
    return () => {
      if (members.get(id) === controller) members.delete(id);
    };
  };
 
  const play: MotionGroup["play"] = (id, event, options) => {
    bumpGeneration();
    return playMember(id, event, options);
  };
 
  const playSlot: MotionGroup["playSlot"] = (id, slot, event, options) => {
    bumpGeneration();
    return playSlotMember(id, slot, event, options);
  };
 
  const playAll: MotionGroup["playAll"] = async (event, options) => {
    const gen = ++generation;
    if (activeGsap) {
      activeGsap.kill();
      activeGsap = null;
    }
    return playAllMembers(event, options, gen);
  };
 
  const set: MotionGroup["set"] = (id, slot, vars) => {
    bumpGeneration();
    setMember(id, slot, vars);
  };
 
  const cancel: MotionGroup["cancel"] = (
    id?: string,
    slot?: string,
    reason: MotionCancelReason = "killed",
  ) => {
    bumpGeneration();
    if (id == null) {
      for (const controller of members.values()) {
        controller.cancel(slot, reason);
      }
      return;
    }
    const controller = resolveMember(id, "cancel");
    if (!controller) return;
    controller.cancel(slot, reason);
  };
 
  const timeline = (): MotionGroupTimeline => {
    bumpGeneration();
    const tl = gsap.timeline({ paused: true });
    activeGsap = tl;
    const gen = generation;
    const runs: MotionRun[] = [];
 
    queueMicrotask(() => {
      if (activeGsap === tl && generation === gen) tl.play();
    });
 
    const ifCurrent = (fn: () => void) => () => {
      if (generation !== gen) return;
      fn();
    };
 
    const track = (run: MotionRun) => {
      runs.push(run);
    };
 
    const api: MotionGroupTimeline = {
      play(id, event, options?: MotionGroupTimelinePlayOptions) {
        const { position, ...rest } = options ?? {};
        tl.call(
          ifCurrent(() => {
            track(playMember(id, event, rest));
          }),
          [],
          position,
        );
        return api;
      },
      playSlot(id, slot, event, options?: MotionGroupTimelinePlayOptions) {
        const { position, ...rest } = options ?? {};
        tl.call(
          ifCurrent(() => {
            track(playSlotMember(id, slot, event, rest));
          }),
          [],
          position,
        );
        return api;
      },
      playAll(event, options?: MotionGroupTimelinePlayAllOptions) {
        const { position, ...rest } = options ?? {};
        tl.call(
          ifCurrent(() => {
            void playAllMembers(event, rest, gen, runs);
          }),
          [],
          position,
        );
        return api;
      },
      set(id, slot, vars, position?: MotionTimelinePosition) {
        tl.call(
          ifCurrent(() => {
            setMember(id, slot, vars);
          }),
          [],
          position,
        );
        return api;
      },
      call(fn, position?: MotionTimelinePosition) {
        tl.call(ifCurrent(fn), [], position);
        return api;
      },
      kill() {
        tl.kill();
        if (activeGsap === tl) {
          activeGsap = null;
          generation += 1;
        }
        for (const run of runs) run.cancel("killed");
      },
    };
 
    return api;
  };
 
  return {
    register,
    unregister(id) {
      if (!id) {
        warnDev("empty member id (unregister)");
        return;
      }
      members.delete(id);
    },
    has: (id) => members.has(id),
    get: (id) => members.get(id) ?? null,
    ids: () => [...members.keys()],
    getTarget(id, slot) {
      const controller = resolveMember(id, "getTarget");
      return controller?.getTarget(slot) ?? null;
    },
    getTargets(id, slot) {
      const controller = resolveMember(id, "getTargets");
      return controller?.getTargets(slot) ?? [];
    },
    play,
    playSlot,
    playAll,
    set,
    cancel,
    timeline,
  };
}
 
/** Registry handle. Register child `MotionController`s by id; no `motionId` on kit roots. */
export function createMotionGroup(): MotionGroup;
export function createMotionGroup<TEvent extends string>(): MotionGroup<TEvent>;
export function createMotionGroup<TEvent extends string>(): MotionGroup<TEvent> {
  return createBoundGroup() as MotionGroup<TEvent>;
}
 
const MotionGroupContext = createContext<MotionGroup | null>(null);
 
export function MotionGroupProvider({
  group,
  children,
}: {
  group: MotionGroup;
  children: ReactNode;
}) {
  return <MotionGroupContext.Provider value={group}>{children}</MotionGroupContext.Provider>;
}
 
/** Nearest `MotionGroupProvider`. Throws outside a provider. */
export function useMotionGroup(): MotionGroup {
  const ctx = useContext(MotionGroupContext);
  if (!ctx) {
    throw new Error("useMotionGroup must be used inside a MotionGroupProvider.");
  }
  return ctx;
}
 
export function useOptionalMotionGroup(): MotionGroup | null {
  return useContext(MotionGroupContext);
}
 
/** Stable `createMotionGroup()` for the lifetime of the component. */
export function useMotionGroupHandle(): MotionGroup;
export function useMotionGroupHandle<TEvent extends string>(): MotionGroup<TEvent>;
export function useMotionGroupHandle<TEvent extends string>(): MotionGroup<TEvent> {
  const [group] = useState(() => createMotionGroup<TEvent>());
  return group;
}
 
/**
 * Register `controller` on the group for this mount. Unregisters on unmount / id change.
 * Pass `group` or wrap with `MotionGroupProvider`.
 */
export function useMotionGroupMember(
  id: string,
  controller: MotionController<string>,
  group?: MotionGroup | null,
): void {
  const ctx = useOptionalMotionGroup();
  const target = group ?? ctx;
 
  useLayoutEffect(() => {
    if (!target) {
      if (process.env.NODE_ENV !== "production") {
        console.error(
          "[burne-ui] MotionGroup: useMotionGroupMember needs a group or MotionGroupProvider",
        );
      }
      return;
    }
    return target.register(id, controller);
  }, [target, id, controller]);
}
 
export function MotionGroupMember({
  id,
  controller,
  group,
  children,
}: {
  id: string;
  controller: MotionController<string>;
  group?: MotionGroup;
  children?: ReactNode;
}) {
  useMotionGroupMember(id, controller, group);
  return children ?? null;
}
 
MotionGroupMember.displayName = "MotionGroupMember";
 