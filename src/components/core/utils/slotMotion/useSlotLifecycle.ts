import { useLayoutEffect, useRef, type RefObject } from "react";

import { gsap } from "@/components/core/utils/gsapMotion";

import type { MotionScopeValue } from "./createMotionScope";
import type { MotionPartPhases, MotionPhaseName, MotionSlotMap } from "./slotMotionTypes";

/** `enter: false` must not leave a first-paint `visibility: hidden`. */
function revealEnterSkip(el: HTMLElement): void {
  if (el.style.visibility !== "hidden") return;
  gsap.set(el, { autoAlpha: 1, force3D: false });
}

function resolveLifecycleEl(
  scope: MotionScopeValue,
  slot: string,
  target?: RefObject<HTMLElement | null> | HTMLElement | null,
): HTMLElement | null {
  if (target == null) return scope.getTarget(slot);
  if (target instanceof HTMLElement) return target;
  return target.current;
}

export function hasPointerPhases(part?: MotionPartPhases): boolean {
  if (!part) return false;
  return (
    part.hoverIn != null ||
    part.hoverOut != null ||
    part.pressIn != null ||
    part.pressOut != null
  );
}

export function slotHasPointerPhases(
  motion: MotionSlotMap | undefined,
  slot: string,
): boolean {
  return hasPointerPhases(motion?.[slot]);
}

/**
 * Play `enter` once the slot target is registered (`useMotionPart` ref).
 * Pass the part `targetRef` for repeated slots so this instance plays, not the first.
 * `undefined` — no play, no visual change (empty default).
 * `false` — skip without kill; restore if a hide leaked (`visibility: hidden`).
 */
export function useOptionalEnterOnMount(
  scope: MotionScopeValue | null,
  slot: string,
  target?: RefObject<HTMLElement | null> | HTMLElement | null,
) {
  const playedRef = useRef(false);

  useLayoutEffect(() => {
    if (!scope || playedRef.current) return;
    const el = resolveLifecycleEl(scope, slot, target);
    if (!el) return;
    const value = scope.resolve(slot, "enter");
    if (value === undefined) {
      playedRef.current = true;
      return;
    }
    if (value === false) {
      playedRef.current = true;
      revealEnterSkip(el);
      return;
    }
    playedRef.current = true;
    scope.play(slot, "enter", { el });
  });
}

/**
 * Play a phase when `identity` changes.
 * First commit is skipped by default so mount stays `enter`-only.
 * Pass `target` (part `targetRef`) so repeated slots play this instance.
 * Default phase is `change`.
 */
export function useSlotPhaseOnChange(
  scope: MotionScopeValue | null,
  slot: string,
  identity: unknown,
  options?: {
    phase?: MotionPhaseName;
    skipFirst?: boolean;
    broadcast?: boolean;
    exclude?: readonly string[];
    target?: RefObject<HTMLElement | null> | HTMLElement | null;
  },
) {
  const phase = options?.phase ?? "change";
  const skipFirst = options?.skipFirst ?? true;
  const broadcast = options?.broadcast ?? false;
  const excludeKey = options?.exclude?.join("\0") ?? "";
  const prevRef = useRef<unknown>(SENTINEL);

  useLayoutEffect(() => {
    if (!scope) return;
    if (prevRef.current === SENTINEL) {
      prevRef.current = identity;
      if (skipFirst) return;
    }
    if (Object.is(prevRef.current, identity)) return;
    prevRef.current = identity;

    const el = resolveLifecycleEl(scope, slot, options?.target);
    if (el) {
      const value = scope.resolve(slot, phase);
      if (value !== undefined && value !== false) {
        scope.play(slot, phase, { el });
      }
    }

    if (!broadcast) return;
    const exclude = excludeKey.length > 0 ? excludeKey.split("\0") : [];
    void scope.playBroadcast(phase, { exclude: [slot, ...exclude] });
  }, [broadcast, excludeKey, identity, options?.target, phase, scope, skipFirst, slot]);
}

const SENTINEL: unique symbol = Symbol("slot-phase-uninit");
