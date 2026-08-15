/**
 * Shared Dialog / Drawer slot-motion host: enter/leave on overlay+panel,
 * nested broadcast, instant closed/open when a host slot is `false`.
 *
 * Engine `false` skips without changing visuals — the modal host must apply
 * the closed (or open) state itself, or the sibling tween (overlay fade)
 * holds the portal open with the panel still on screen.
 */
import { useMemo, useRef } from "react";

import { gsap } from "@/components/core/utils/gsapMotion";

import { killMotionTargets, type MotionScopeValue } from "./createMotionScope";
import { isMotionVarsObject, type MotionValue } from "./slotMotionTypes";

export const MODAL_MOTION_HOST_SLOTS = ["overlay", "panel"] as const;

export type ModalHostSlot = (typeof MODAL_MOTION_HOST_SLOTS)[number];

export type ModalSlotMotionController = {
  playEnter: (overlay: HTMLElement, panel: HTMLElement) => void;
  playLeave: (
    overlay: HTMLElement,
    panel: HTMLElement,
    onComplete: () => void,
  ) => { kill: () => void };
};

function enterHidesFirstPaint(value: MotionValue | undefined): boolean {
  if (value === undefined || value === false) return false;
  return isMotionVarsObject(value) && value.autoAlpha !== undefined;
}

function hideNestedEnterSlots(scope: MotionScopeValue, exclude: readonly string[]): void {
  const skip = new Set(exclude);
  const targets = scope.getTargets();
  const slots = new Set([
    ...Object.keys(scope.getDefaults() ?? {}),
    ...Object.keys(scope.getRootMotion() ?? {}),
    ...Object.keys(targets),
  ]);
  for (const slot of slots) {
    if (skip.has(slot)) continue;
    const el = targets[slot];
    if (!el) continue;
    if (!enterHidesFirstPaint(scope.resolve(slot, "enter"))) continue;
    gsap.set(el, { autoAlpha: 0, force3D: false });
  }
}

function playHostPhase(
  scope: MotionScopeValue,
  slot: ModalHostSlot,
  el: HTMLElement,
  phase: "enter" | "leave",
  applyInstant: ((slot: ModalHostSlot, el: HTMLElement, phase: "enter" | "leave") => void) | undefined,
  waitForComplete: boolean,
) {
  const value = scope.resolve(slot, phase);
  if (value === false) {
    applyInstant?.(slot, el, phase);
  }
  return scope.play(slot, phase, { el, waitForComplete });
}

export function useModalSlotMotionController({
  motionScope,
  applyInstant,
}: {
  motionScope?: MotionScopeValue | null;
  applyInstant?: (slot: ModalHostSlot, el: HTMLElement, phase: "enter" | "leave") => void;
}): ModalSlotMotionController | undefined {
  const enterFrameRef = useRef(0);
  const enterGenRef = useRef(0);

  return useMemo(() => {
    if (!motionScope) return undefined;
    const scope = motionScope;
    const cancelEnterFrame = () => {
      enterGenRef.current += 1;
      if (enterFrameRef.current) {
        cancelAnimationFrame(enterFrameRef.current);
        enterFrameRef.current = 0;
      }
    };
    return {
      playEnter: (overlay: HTMLElement, panel: HTMLElement) => {
        cancelEnterFrame();
        const gen = enterGenRef.current;
        playHostPhase(scope, "overlay", overlay, "enter", applyInstant, false);
        playHostPhase(scope, "panel", panel, "enter", applyInstant, false);
        hideNestedEnterSlots(scope, MODAL_MOTION_HOST_SLOTS);
        enterFrameRef.current = requestAnimationFrame(() => {
          if (gen !== enterGenRef.current) return;
          enterFrameRef.current = 0;
          void overlay.offsetHeight;
          void scope.playBroadcast("enter", { exclude: [...MODAL_MOTION_HOST_SLOTS] });
        });
      },
      playLeave: (
        overlay: HTMLElement,
        panel: HTMLElement,
        onComplete: () => void,
      ) => {
        cancelEnterFrame();
        let cancelled = false;
        const overlayRun = playHostPhase(
          scope,
          "overlay",
          overlay,
          "leave",
          applyInstant,
          true,
        );
        const panelRun = playHostPhase(scope, "panel", panel, "leave", applyInstant, true);
        const extra = scope.playBroadcast("leave", {
          exclude: [...MODAL_MOTION_HOST_SLOTS],
          waitForComplete: true,
        });
        void Promise.all([overlayRun.finished, panelRun.finished, extra]).then(() => {
          if (!cancelled) onComplete();
        });
        return {
          kill: () => {
            cancelled = true;
            overlayRun.animation?.kill();
            panelRun.animation?.kill();
            killMotionTargets(scope.getTargets());
          },
        };
      },
    };
  }, [applyInstant, motionScope]);
}
