/**
 * Shared Dialog / Drawer slot-motion host: enter/leave on overlay+panel,
 * nested broadcast, instant closed/open when a host slot is `false`.
 *
 * Engine `false` skips without changing visuals — the modal host must apply
 * the closed (or open) state itself, or the sibling tween (overlay fade)
 * holds the portal open with the panel still on screen.
 */
import { useCallback, useEffect, useMemo, useRef } from "react";

import { killMotionScope, hideNestedEnterSlots, type MotionScopeValue } from "./createMotionScope";
import { invalidateEnterFrame, scheduleNestedEnterBroadcast } from "./scheduleNestedEnterBroadcast";
import { waitForLeaveGeneration } from "./waitForLeaveGeneration";

export const MODAL_MOTION_HOST_SLOTS = ["overlay", "panel"] as const;

export type ModalHostSlot = (typeof MODAL_MOTION_HOST_SLOTS)[number];

export type ModalSlotMotionController = {
  playEnter: (overlay: HTMLElement, panel: HTMLElement) => void;
  playLeave: (
    overlay: HTMLElement,
    panel: HTMLElement,
    onComplete: () => void,
  ) => { kill: () => void };
  /** Cancel a pending nested-enter rAF (unmount / superseded play). */
  cancelEnterFrame: () => void;
};

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

  const cancelEnterFrame = useCallback(
    () => invalidateEnterFrame(enterFrameRef, enterGenRef),
    [],
  );

  useEffect(() => cancelEnterFrame, [cancelEnterFrame, motionScope, applyInstant]);

  return useMemo(() => {
    if (!motionScope) return undefined;
    const scope = motionScope;
    return {
      cancelEnterFrame,
      playEnter: (overlay: HTMLElement, panel: HTMLElement) => {
        cancelEnterFrame();
        const gen = enterGenRef.current;
        playHostPhase(scope, "overlay", overlay, "enter", applyInstant, false);
        playHostPhase(scope, "panel", panel, "enter", applyInstant, false);
        hideNestedEnterSlots(scope, MODAL_MOTION_HOST_SLOTS);
        enterFrameRef.current = scheduleNestedEnterBroadcast(scope, MODAL_MOTION_HOST_SLOTS, () => {
          if (gen !== enterGenRef.current) return false;
          enterFrameRef.current = 0;
          return true;
        });
      },
      playLeave: (
        overlay: HTMLElement,
        panel: HTMLElement,
        onComplete: () => void,
      ) => {
        cancelEnterFrame();
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
        return waitForLeaveGeneration({
          runs: [overlayRun, panelRun],
          extra,
          onComplete,
          onKill: () => killMotionScope(scope),
        });
      },
    };
  }, [applyInstant, cancelEnterFrame, motionScope]);
}
