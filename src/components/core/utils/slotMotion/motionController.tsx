import { createContext, useContext, useState, type ReactNode } from "react";

import { gsap } from "@/components/core/utils/gsapMotion";

import type { MotionRegistration } from "./createMotionRegistry";
import type { MotionScopeValue } from "./createMotionScope";
import { killStoredMotion } from "./runMotionPhase";
import {
  isMotionPhaseName,
  type MotionCancelReason,
  type MotionRun,
  type MotionRunStatus,
  type MotionTransformVars,
} from "./slotMotionTypes";
import type {
  MotionController,
  MotionPlayOptions,
} from "./motionControllerTypes";

const SET_KEYS = [
  "x",
  "y",
  "scale",
  "scaleX",
  "scaleY",
  "rotation",
  "rotate",
  "autoAlpha",
  "opacity",
] as const;

const attachments = new WeakMap<MotionController<string>, MotionScopeValue | null>();

let idleRunId = 0;

function warnDev(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[burne-ui] MotionController: ${message}`);
  }
}

function settledRun(status: MotionRunStatus): MotionRun {
  return {
    id: --idleRunId,
    status,
    finished: Promise.resolve(),
    animation: undefined,
    cancel() {},
    cleanup() {},
    isCurrent: () => false,
  };
}

function pickSetVars(vars: MotionTransformVars): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  for (const key of SET_KEYS) {
    const value = vars[key];
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function bindExternalSignal(signal: AbortSignal | undefined, run: MotionRun): void {
  if (!signal) return;
  const abort = () => run.cancel("killed");
  if (signal.aborted) {
    abort();
    return;
  }
  signal.addEventListener("abort", abort, { once: true });
  void run.finished.then(() => signal.removeEventListener("abort", abort));
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

function playOnScope(
  scope: MotionScopeValue,
  slot: string,
  event: string,
  options?: MotionPlayOptions,
): MotionRun {
  const isPhase = isMotionPhaseName(event);
  const eventValue = isPhase ? undefined : (options?.value ?? scope.getEvents()?.[event]);
  if (!isPhase && (eventValue === undefined || eventValue === false)) {
    warnDev(`missing event "${event}"`);
    return settledRun("finished");
  }
  const el = options?.el ?? scope.getTarget(slot);
  if (!el) {
    warnDev(`missing target "${slot}"`);
    return settledRun("cancelled");
  }
  const run = scope.play(slot, event, {
    el,
    waitForComplete: options?.waitForComplete,
    partValue: isPhase ? options?.value : eventValue,
  });
  bindExternalSignal(options?.signal, run);
  return run;
}

function createBoundController(getScope: () => MotionScopeValue | null): MotionController {
  let playAllGeneration = 0;

  const invalidatePlayAll = () => {
    playAllGeneration += 1;
  };

  const play: MotionController["play"] = (event, options) => {
    const scope = getScope();
    if (!scope) {
      warnDev("not attached to a motion scope");
      return settledRun("cancelled");
    }
    invalidatePlayAll();
    return playOnScope(scope, options?.slot ?? "root", event, options);
  };

  const playSlot: MotionController["playSlot"] = (slot, event, options) => {
    return play(event, { ...options, slot });
  };

  const playAll: MotionController["playAll"] = async (event, options) => {
    const scope = getScope();
    if (!scope) {
      warnDev("not attached to a motion scope");
      return { runs: [settledRun("cancelled")] };
    }
    const generation = ++playAllGeneration;
    const isPhase = isMotionPhaseName(event);
    const eventValue = isPhase ? undefined : scope.getEvents()?.[event];
    if (!isPhase && (eventValue === undefined || eventValue === false)) {
      warnDev(`missing event "${event}"`);
      return { runs: [] };
    }

    const exclude = new Set(options?.exclude ?? []);
    const staggerSec = options?.stagger;
    const staggerMs =
      staggerSec != null && Number.isFinite(staggerSec) && staggerSec > 0 ? staggerSec * 1000 : 0;
    if (staggerSec != null && !(Number.isFinite(staggerSec) && staggerSec >= 0)) {
      warnDev(`stagger=${String(staggerSec)} ignored (need a finite number ≥ 0, seconds)`);
    }

    const byNode = new Map<HTMLElement, MotionRegistration[]>();
    for (const reg of scope.getRegistrations()) {
      if (exclude.has(reg.slot)) continue;
      const list = byNode.get(reg.node);
      if (list) list.push(reg);
      else byNode.set(reg.node, [reg]);
    }

    const items = [...byNode.values()];
    const runs: MotionRun[] = [];
    let index = 0;
    for (const regs of items) {
      if (generation !== playAllGeneration || options?.signal?.aborted) break;
      if (staggerMs > 0 && index > 0) {
        const ok = await waitMs(staggerMs, options?.signal);
        if (!ok || generation !== playAllGeneration) break;
      }
      const chosen =
        [...regs].reverse().find((reg) => reg.motion != null) ?? regs[regs.length - 1];
      if (!scope.getRegistrations(chosen.slot).some((reg) => reg.node === chosen.node)) {
        index += 1;
        continue;
      }
      if (isPhase) {
        const value = scope.resolve(chosen.slot, event);
        if (value === undefined || value === false) {
          index += 1;
          continue;
        }
      }
      runs.push(
        playOnScope(scope, chosen.slot, event, {
          el: chosen.node,
          waitForComplete: options?.waitForComplete,
          signal: options?.signal,
          value: isPhase ? undefined : eventValue,
        }),
      );
      index += 1;
    }

    if (options?.waitForComplete) {
      await Promise.all(runs.map((run) => run.finished));
    }
    return { runs };
  };

  const set: MotionController["set"] = (slot, vars) => {
    const scope = getScope();
    if (!scope) {
      warnDev("not attached to a motion scope");
      return;
    }
    invalidatePlayAll();
    const nodes = scope.getTargets(slot);
    if (nodes.length === 0) {
      warnDev(`missing target "${slot}"`);
      return;
    }
    const props = pickSetVars(vars);
    if (Object.keys(props).length === 0) return;
    for (const el of nodes) {
      killStoredMotion(el, "killed");
      gsap.set(el, { ...props, force3D: false });
    }
  };

  const cancel: MotionController["cancel"] = (slot, reason: MotionCancelReason = "killed") => {
    const scope = getScope();
    if (!scope) return;
    invalidatePlayAll();
    if (slot == null) {
      const seen = new Set<HTMLElement>();
      for (const reg of scope.getRegistrations()) {
        if (seen.has(reg.node)) continue;
        seen.add(reg.node);
        killStoredMotion(reg.node, reason);
      }
      return;
    }
    for (const el of scope.getTargets(slot)) {
      killStoredMotion(el, reason);
    }
  };

  return {
    play,
    playSlot,
    playAll,
    set,
    cancel,
    getTarget: (slot) => getScope()?.getTarget(slot) ?? null,
    getTargets: (slot) => getScope()?.getTargets(slot) ?? [],
  };
}

/** Deferred handle. Pass to `motionController` / Provider `controller`; attach on mount. */
export function createMotionController(): MotionController;
export function createMotionController<TEvent extends string>(): MotionController<TEvent>;
export function createMotionController<TEvent extends string>(): MotionController<TEvent> {
  const controller = createBoundController(
    () => attachments.get(controller as MotionController<string>) ?? null,
  ) as MotionController<TEvent>;
  attachments.set(controller as MotionController<string>, null);
  return controller;
}

/** Stable handle for the current scope (tests / `createMotionScopeController`). */
export function createMotionControllerFromScope(
  scope: MotionScopeValue,
): MotionController {
  return createBoundController(() => scope);
}

/** Bind a deferred handle to a live scope. `null` detaches (unmount). One handle → one scope. */
export function attachMotionController(
  controller: MotionController<string>,
  scope: MotionScopeValue | null,
): void {
  if (process.env.NODE_ENV !== "production" && scope) {
    const current = attachments.get(controller);
    if (current != null && current !== scope) {
      warnDev("handle already attached to another scope (one handle → one scope)");
    }
  }
  attachments.set(controller, scope);
}

const MotionControllerContext = createContext<MotionController | null>(null);

export function MotionControllerProvider({
  controller,
  children,
}: {
  controller: MotionController;
  children: ReactNode;
}) {
  return (
    <MotionControllerContext.Provider value={controller}>
      {children}
    </MotionControllerContext.Provider>
  );
}

/** Nearest motion scope (Alert / Dialog / …). Throws outside a scope. */
export function useMotionController(): MotionController {
  const ctx = useContext(MotionControllerContext);
  if (!ctx) {
    throw new Error("useMotionController must be used inside a Burne UI motion scope.");
  }
  return ctx;
}

export function useOptionalMotionController(): MotionController | null {
  return useContext(MotionControllerContext);
}

/** Stable `createMotionController()` for the lifetime of the component. */
export function useMotionControllerHandle(): MotionController;
export function useMotionControllerHandle<TEvent extends string>(): MotionController<TEvent>;
export function useMotionControllerHandle<TEvent extends string>(): MotionController<TEvent> {
  const [controller] = useState(() => createMotionController<TEvent>());
  return controller;
}
