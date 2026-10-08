/**
 * Slot motion for Drawer — look here first.
 *
 * DOM slots: `backdrop`, `panel`, `title`, `description`, `close`, `header`,
 * `headingBlock`, `footer`, `content`, `body`, `handle`, plus `trigger` on Root.
 * Host: `Drawer.Panel` (`useDrawerModalMotion`) plays `enter` / `leave` and
 * broadcasts nested slots (`scheduleNestedEnterBroadcast`, exclude backdrop/panel).
 * Nested parts do not call `useOptionalEnterOnMount`. Root has no portal DOM — it
 * passes the `motion` map and trigger defaults. Backdrop/panel defaults wrap the portal host
 * (`DRAWER_MOTION_DEFAULTS` on the Panel provider). `params.placement` feeds
 * `drawerSlide*` recipes.
 */
import { useCallback } from "react";
 
import { gsap } from "@/components/core/utils/gsapMotion";
import { useModalMotion } from "@/components/core/utils/useModalMotion";
import {
  useModalSlotMotionController,
  type ModalHostSlot,
} from "@/components/core/utils/slotMotion/modalSlotMotionHost";
import { applyModalOverlayInstant } from "@/components/core/utils/slotMotion/recipes/modalSurface";
import { applyDrawerPanelInstant } from "@/components/core/utils/slotMotion/recipes/drawerSlide";
import type { MotionScopeValue } from "@/components/core/utils/slotMotion";
 
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { DrawerMotion, DrawerVariant, UseDrawerModalMotionProps } from "./drawerTypes";
import { KIT_DRAWER_VARIANTS } from "./drawerTypes";
 
export const DRAWER_MOTION_HOST_SLOTS = ["backdrop", "panel"] as const;
 
export const DRAWER_MOTION_DEFAULTS: DrawerMotion = {
  backdrop: { enter: "modalOverlayEnter", leave: "modalOverlayLeave" },
  panel: { enter: "drawerSlideEnter", leave: "drawerSlideLeave" },
};

export function resolveDrawerMotionDefaults(variant: DrawerVariant): DrawerMotion {
  return overlaySkinMotion(DRAWER_MOTION_DEFAULTS, variant, KIT_DRAWER_VARIANTS, "drawer");
}
 
function prepareDrawerPanel(panel: HTMLElement): void {
  gsap.set(panel, { xPercent: 0, yPercent: 0, x: 0, y: 0 });
}
 
export function useDrawerModalMotion({
  open,
  onOpenChange,
  placement,
  backdropIsDismissable,
  contained = false,
  motionScope,
}: UseDrawerModalMotionProps & { motionScope?: MotionScopeValue | null }) {
  const applyInstant = useCallback(
    (slot: ModalHostSlot, el: HTMLElement, phase: "enter" | "leave") => {
      const nextOpen = phase === "enter";
      if (slot === "backdrop") applyModalOverlayInstant(el, nextOpen);
      else applyDrawerPanelInstant(el, placement, nextOpen);
    },
    [placement],
  );
  const slotMotion = useModalSlotMotionController({
    motionScope,
    applyInstant,
    hostSlots: DRAWER_MOTION_HOST_SLOTS,
  });
 
  const motion = useModalMotion({
    open,
    contained,
    onOpenChange,
    dismissOnBackdrop: backdropIsDismissable,
    enableContainedEscape: true,
    panelMotionKey: placement,
    preparePanel: prepareDrawerPanel,
    slotMotion,
  });
 
  return {
    showPortal: motion.showPortal,
    mounted: motion.mounted,
    dialogRef: motion.dialogRef,
    overlayRef: motion.overlayRef,
    panelRef: motion.panelRef,
    skipCloseAnimRef: motion.skipCloseAnimRef,
    handleBackdropMouseDown: motion.handleBackdropPointerDown,
  };
}
 