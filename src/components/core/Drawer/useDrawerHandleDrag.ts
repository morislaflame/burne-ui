import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
 
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractiveFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
 
import type { DrawerPlacement } from "./drawerTypes";
 
export const DRAG_SLOP_PX = 4;
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
  const denom = Math.abs(dismissDelta);
  if (denom <= 0) return 1;
  const progress = Math.min(Math.abs(clamped) / denom, 1);
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
  consumeDragClick: () => boolean;
} {
  const config = useMotionConfig();
  const activeCleanupRef = useRef<(() => void) | null>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    return () => {
      activeCleanupRef.current?.();
      activeCleanupRef.current = null;
    };
  }, []);

  const consumeDragClick = useCallback(() => {
    if (!didDragRef.current) return false;
    didDragRef.current = false;
    return true;
  }, []);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (disabled) return;
      if ((e.button ?? 0) !== 0) return;
      const panel = panelRef.current;
      const overlay = overlayRef.current;
      if (!panel) return;
      if (prefersReducedMotion()) return;

      activeCleanupRef.current?.();
      didDragRef.current = false;

      const axis = getTranslateAxis(placement);
      const isX = axis === "x";
      const dismissDir = placement === "left" || placement === "top" ? -1 : 1;
      const startClient = isX ? e.clientX : e.clientY;
      const pointerId = e.pointerId;
      const handle = e.currentTarget;

      let lastClient = startClient;
      let lastTime = performance.now();
      let velocity = 0;
      let maxTravel = 0;
      let dragging = false;
      let captured = false;

      const clampDelta = (delta: number) =>
        dismissDir > 0 ? Math.max(0, delta) : Math.min(0, delta);

      const cleanupListeners = () => {
        if (captured) {
          captured = false;
          try {
            handle.releasePointerCapture?.(pointerId);
          } catch {
            // Pointer may already be released or unmounted.
          }
        }
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        if (activeCleanupRef.current === cleanupListeners) {
          activeCleanupRef.current = null;
        }
      };

      const onMove = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        const client = isX ? ev.clientX : ev.clientY;
        const delta = client - startClient;
        const absDelta = Math.abs(delta);
        if (absDelta > maxTravel) maxTravel = absDelta;

        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) velocity = (client - lastClient) / dt;
        lastClient = client;
        lastTime = now;

        if (!dragging) {
          if (maxTravel < DRAG_SLOP_PX) return;
          dragging = true;
          try {
            handle.setPointerCapture?.(pointerId);
            captured = true;
          } catch {
            // Synthetic test events may omit active pointer capture.
          }
          killMotion(panel, overlay);
          panel.style.willChange = "transform";
        }

        const dismissDelta = getDismissDelta(placement, panel);
        const clamped = clampDelta(delta);
        setTranslate(panel, axis, clamped);
        if (overlay) {
          gsap.set(overlay, { opacity: overlayOpacityForDrag(clamped, dismissDelta) });
        }
      };

      const snapBack = (fromOffset: number) => {
        killMotion(panel, overlay);
        if (fromOffset === 0) {
          panel.style.willChange = "";
          gsap.set(panel, { clearProps: axis });
          if (overlay) gsap.set(overlay, { opacity: 1 });
          return;
        }
        const vars = { ...motionInteractiveFor(config), overwrite: "auto" as const };
        const tl = gsap.timeline({
          onComplete: () => {
            panel.style.willChange = "";
            gsap.set(panel, { clearProps: axis });
            if (overlay) gsap.set(overlay, { opacity: 1 });
          },
        });
        tl.fromTo(panel, { [axis]: fromOffset }, { [axis]: 0, ...vars }, 0);
        if (overlay) {
          tl.to(overlay, { opacity: 1, ...vars }, 0);
        }
      };

      const onCancel = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        cleanupListeners();
        if (!dragging) return;
        didDragRef.current = true;
        setTimeout(() => {
          didDragRef.current = false;
        }, 0);
        const client = isX ? ev.clientX : ev.clientY;
        snapBack(clampDelta(client - startClient));
      };

      const onUp = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        const client = isX ? ev.clientX : ev.clientY;
        const delta = client - startClient;
        if (Math.abs(delta) > maxTravel) maxTravel = Math.abs(delta);
        cleanupListeners();

        // Tap (< DRAG_SLOP_PX): let the grip <button> click close the Drawer.
        if (!dragging && maxTravel < DRAG_SLOP_PX) {
          return;
        }

        didDragRef.current = true;
        setTimeout(() => {
          didDragRef.current = false;
        }, 0);

        const dismissDelta = getDismissDelta(placement, panel);
        const clamped = clampDelta(delta);
        const outward = Math.abs(clamped);
        const absDismiss = Math.abs(dismissDelta);
        const ratio = absDismiss > 0 ? outward / absDismiss : 0;
        const dismissVelMet =
          outward > 0 &&
          (dismissDir > 0
            ? velocity > DISMISS_VELOCITY
            : velocity < -DISMISS_VELOCITY);

        if (ratio >= DISMISS_RATIO || dismissVelMet) {
          const vars = { ...motionInteractiveFor(config), overwrite: "auto" as const };
          killMotion(panel, overlay);
          const tl = gsap.timeline({
            onComplete: () => {
              panel.style.willChange = "";
              if (skipCloseAnimRef) skipCloseAnimRef.current = true;
              onClose();
            },
          });
          tl.fromTo(panel, { [axis]: clamped }, { [axis]: dismissDelta, ...vars }, 0);
          if (overlay) {
            tl.to(overlay, { opacity: 0, ...vars }, 0);
          }
        } else {
          snapBack(clamped);
        }
      };

      activeCleanupRef.current = cleanupListeners;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    },
    [config, disabled, onClose, overlayRef, panelRef, placement, skipCloseAnimRef],
  );

  return { onPointerDown, consumeDragClick };
}
 