import { animate, remove } from "animejs";
import { useCallback, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { MOTION_INTERACTIVE_EASE, MOTION_INTERACTIVE_MS } from "@/components/core/utils/motionTokens";

import type { DrawerPlacement } from "./drawerTypes";

const DISMISS_RATIO = 0.38;
const DISMISS_VELOCITY = 0.45;

function getDismissDelta(placement: DrawerPlacement, panel: HTMLElement): number {
  if (placement === "left") return -panel.offsetWidth;
  if (placement === "right") return panel.offsetWidth;
  if (placement === "top") return -panel.offsetHeight;
  return panel.offsetHeight;
}

function getTranslateAxis(placement: DrawerPlacement): "X" | "Y" {
  return placement === "left" || placement === "right" ? "X" : "Y";
}

function setTranslate(el: HTMLElement, axis: "X" | "Y", px: number) {
  el.style.transform = `translate${axis}(${px}px)`;
}

export function useDrawerHandleDrag(
  panelRef: RefObject<HTMLElement | null>,
  placement: DrawerPlacement,
  onClose: () => void,
  disabled: boolean,
  /** Ref, который нужно поставить в `true` перед вызовом onClose, чтобы
   *  close-эффект в DrawerRoot пропустил повторную анимацию. */
  skipCloseAnimRef?: RefObject<boolean>,
): {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
} {
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (disabled) return;
      const panel = panelRef.current;
      if (!panel) return;
      if (prefersReducedInteractiveHoverLift()) return;

      const axis = getTranslateAxis(placement);
      const isX = axis === "X";
      const startClient = isX ? e.clientX : e.clientY;
      let lastClient = startClient;
      let lastTime = performance.now();
      let velocity = 0;

      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);

      remove(panel);
      panel.style.willChange = "transform";

      const onMove = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        const client = isX ? ev.clientX : ev.clientY;
        const delta = client - startClient;
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) velocity = (client - lastClient) / dt;
        lastClient = client;
        lastTime = now;

        const dismissDir = placement === "left" || placement === "top" ? -1 : 1;
        const clamped = dismissDir > 0 ? Math.max(0, delta) : Math.min(0, delta);
        setTranslate(panel, axis, clamped);
      };

      const onUp = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        handle.releasePointerCapture(e.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);

        const client = isX ? ev.clientX : ev.clientY;
        const delta = client - startClient;
        const dismissDelta = getDismissDelta(placement, panel);
        const ratio = Math.abs(delta) / Math.abs(dismissDelta);
        const dismissVelMet =
          placement === "right" || placement === "bottom"
            ? velocity > DISMISS_VELOCITY
            : velocity < -DISMISS_VELOCITY;

        if (ratio >= DISMISS_RATIO || dismissVelMet) {
          remove(panel);
          void animate(panel, {
            [`translate${axis}`]: [delta, dismissDelta],
            duration: MOTION_INTERACTIVE_MS,
            ease: MOTION_INTERACTIVE_EASE,
          }).then(() => {
            panel.style.willChange = "";
            panel.style.transform = "";
            // Сигнализируем root-у, что анимация закрытия уже выполнена
            if (skipCloseAnimRef) skipCloseAnimRef.current = true;
            onClose();
          });
        } else {
          remove(panel);
          void animate(panel, {
            [`translate${axis}`]: [delta, 0],
            duration: MOTION_INTERACTIVE_MS,
            ease: MOTION_INTERACTIVE_EASE,
          }).then(() => {
            panel.style.willChange = "";
            panel.style.transform = "";
          });
        }
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [disabled, onClose, panelRef, placement, skipCloseAnimRef],
  );

  return { onPointerDown };
}
