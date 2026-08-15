/**
 * Slot motion for Drawer — look here first.
 *
 * DOM slots: `overlay`, `panel`, `title`, `description`, `close`, `header`,
 * `footer`, `content`, `handle`
 * Host: `Drawer.Panel` (`useDrawerModalMotion`) plays `enter` / `leave` and
 * broadcasts nested slots. Root has no portal DOM — it only passes the `motion`
 * map through context. Defaults wrap the portal host (`DRAWER_MOTION_DEFAULTS`
 * on the Panel provider). `params.placement` feeds `drawerSlide*` recipes.
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

import type { DrawerMotion, UseDrawerModalMotionProps } from "./drawerTypes";

export const DRAWER_MOTION_HOST_SLOTS = ["overlay", "panel"] as const;

export const DRAWER_MOTION_DEFAULTS: DrawerMotion = {
  overlay: { enter: "modalOverlayEnter", leave: "modalOverlayLeave" },
  panel: { enter: "drawerSlideEnter", leave: "drawerSlideLeave" },
};

function prepareDrawerPanel(panel: HTMLElement): void {
  gsap.set(panel, { xPercent: 0, yPercent: 0, x: 0, y: 0 });
}

export function useDrawerModalMotion({
  open,
  onOpenChange,
  variant,
  placement,
  backdropIsDismissable,
  contained = false,
  motionScope,
}: UseDrawerModalMotionProps & { motionScope?: MotionScopeValue | null }) {
  const applyInstant = useCallback(
    (slot: ModalHostSlot, el: HTMLElement, phase: "enter" | "leave") => {
      const nextOpen = phase === "enter";
      if (slot === "overlay") applyModalOverlayInstant(el, nextOpen);
      else applyDrawerPanelInstant(el, placement, nextOpen);
    },
    [placement],
  );
  const slotMotion = useModalSlotMotionController({ motionScope, applyInstant });

  const motion = useModalMotion({
    open,
    gloss: variant === "gloss",
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
    bindGlossPanelRef: motion.bindGlossPanelRef,
    handleBackdropMouseDown: motion.handleBackdropPointerDown,
  };
}
