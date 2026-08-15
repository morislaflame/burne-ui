import { useLayoutEffect, useRef } from "react";

import { gsap } from "@/components/core/utils/gsapMotion";

import type { MotionScopeValue } from "./createMotionScope";
import type { MotionPartPhases, MotionSlotMap } from "./slotMotionTypes";

/** `enter: false` must not leave a first-paint `visibility: hidden`. */
function revealEnterSkip(el: HTMLElement): void {
  if (el.style.visibility !== "hidden") return;
  gsap.set(el, { autoAlpha: 1, force3D: false });
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
 * `undefined` — no play, no visual change (empty default).
 * `false` — skip without kill; restore if a hide leaked (`visibility: hidden`).
 */
export function useOptionalEnterOnMount(
  scope: MotionScopeValue | null,
  slot: string,
) {
  const playedRef = useRef(false);

  useLayoutEffect(() => {
    if (!scope || playedRef.current) return;
    const el = scope.getTargets()[slot] ?? null;
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
 */
export function useSlotPhaseOnChange(
  scope: MotionScopeValue | null,
  slot: string,
  identity: unknown,
  options?: {
    phase?: string;
    skipFirst?: boolean;
    broadcast?: boolean;
    exclude?: readonly string[];
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

    const el = scope.getTargets()[slot] ?? null;
    if (el) {
      const value = scope.resolve(slot, phase);
      if (value !== undefined && value !== false) {
        scope.play(slot, phase, { el });
      }
    }

    if (!broadcast) return;
    const exclude = excludeKey.length > 0 ? excludeKey.split("\0") : [];
    void scope.playBroadcast(phase, { exclude: [slot, ...exclude] });
  }, [broadcast, excludeKey, identity, phase, scope, skipFirst, slot]);
}

const SENTINEL: unique symbol = Symbol("slot-phase-uninit");
