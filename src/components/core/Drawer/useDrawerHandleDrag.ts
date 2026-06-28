import { useCallback, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";

import type { DrawerPlacement } from "./drawerTypes";

const DISMISS_RATIO = 0.38;
const DISMISS_VELOCITY = 0.45;

function getDismissDelta(placement: DrawerPlacement, panel: HTMLElement): number {
  if (placement === "left") return -panel.offsetWidth;
  if (placement === "right") return panel.offsetWidth;
  if (placement === "top") return -panel.offsetHeight;
  return panel.offsetHeight;
}

function getTranslateAxis(placement: DrawerPlacement): "x" | "y" {
  return placement === "left" || placement === "right" ? "x" : "y";
}

function setTranslate(el: HTMLElement, axis: "x" | "y", px: number) {
  gsap.set(el, { [axis]: px });
}

function overlayOpacityForDrag(clamped: number, dismissDelta: number): number {
  const progress = Math.min(Math.abs(clamped) / Math.abs(dismissDelta), 1);
  return 1 - progress;
}

export function useDrawerHandleDrag(
  panelRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  placement: DrawerPlacement,
  onClose: () => void,
  disabled: boolean,
  skipCloseAnimRef?: RefObject<boolean>,
): {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
} {
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (disabled) return;
      const panel = panelRef.current;
      const overlay = overlayRef.current;
      if (!panel) return;
      if (prefersReducedInteractiveHoverLift()) return;

      const axis = getTranslateAxis(placement);
      const isX = axis === "x";
      const startClient = isX ? e.clientX : e.clientY;
      let lastClient = startClient;
      let lastTime = performance.now();
      let velocity = 0;
      const dismissDelta = getDismissDelta(placement, panel);

      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);

      killMotion(panel, overlay);
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
        if (overlay) {
          gsap.set(overlay, { opacity: overlayOpacityForDrag(clamped, dismissDelta) });
        }
      };

      const onUp = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        handle.releasePointerCapture(e.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);

        const client = isX ? ev.clientX : ev.clientY;
        const delta = client - startClient;
        const ratio = Math.abs(delta) / Math.abs(dismissDelta);
        const dismissVelMet =
          placement === "right" || placement === "bottom"
            ? velocity > DISMISS_VELOCITY
            : velocity < -DISMISS_VELOCITY;

        const vars = { ...motionInteractive(), overwrite: "auto" as const };

        if (ratio >= DISMISS_RATIO || dismissVelMet) {
          killMotion(panel, overlay);
          const tl = gsap.timeline({
            onComplete: () => {
              panel.style.willChange = "";
              if (skipCloseAnimRef) skipCloseAnimRef.current = true;
              onClose();
            },
          });
          tl.fromTo(panel, { [axis]: delta }, { [axis]: dismissDelta, ...vars }, 0);
          if (overlay) {
            tl.to(overlay, { opacity: 0, ...vars }, 0);
          }
        } else {
          killMotion(panel, overlay);
          const tl = gsap.timeline({
            onComplete: () => {
              panel.style.willChange = "";
              gsap.set(panel, { clearProps: axis });
              if (overlay) gsap.set(overlay, { opacity: 1 });
            },
          });
          tl.fromTo(panel, { [axis]: delta }, { [axis]: 0, ...vars }, 0);
          if (overlay) {
            tl.to(overlay, { opacity: 1, ...vars }, 0);
          }
        }
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [disabled, onClose, overlayRef, panelRef, placement, skipCloseAnimRef],
  );

  return { onPointerDown };
}
