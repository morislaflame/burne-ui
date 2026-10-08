/**
 * Slot motion for Dialog — look here first.
 *
 * DOM slots: `overlay`, `panel`, `title`, `description`, `close`, `header`, `headingBlock`, `footer`, `content`, `body`
 * plus `trigger` on Root (open squeeze). Host: `Dialog.Panel` (`useDialogModalMotion`) plays `enter` / `leave` and broadcasts
 * nested slots (`scheduleNestedEnterBroadcast`, exclude overlay/panel). Nested parts
 * do not call `useOptionalEnterOnMount`. Root has no portal DOM — it passes the `motion`
 * map and trigger defaults. Overlay/panel defaults wrap the portal host (`DIALOG_MOTION_DEFAULTS` on the Panel provider).
 */
import { useCallback } from "react";
 
import { useModalMotion } from "@/components/core/utils/useModalMotion";
import type { MotionScopeValue } from "@/components/core/utils/slotMotion";
import {
  useModalSlotMotionController,
  type ModalHostSlot,
} from "@/components/core/utils/slotMotion/modalSlotMotionHost";
import {
  applyModalOverlayInstant,
  applyModalPanelInstant,
} from "@/components/core/utils/slotMotion/recipes/modalSurface";
 
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { DialogMotion, DialogVariant, UseDialogModalMotionProps } from "./dialogTypes";
import { KIT_DIALOG_VARIANTS } from "./dialogTypes";
 
export const DIALOG_MOTION_HOST_SLOTS = ["overlay", "panel"] as const;
 
export const DIALOG_MOTION_DEFAULTS: DialogMotion = {
  overlay: { enter: "modalOverlayEnter", leave: "modalOverlayLeave" },
  panel: { enter: "modalPanelEnter", leave: "modalPanelLeave" },
};

export function resolveDialogMotionDefaults(variant: DialogVariant): DialogMotion {
  return overlaySkinMotion(DIALOG_MOTION_DEFAULTS, variant, KIT_DIALOG_VARIANTS, "dialog");
}
 
function applyDialogHostInstant(slot: ModalHostSlot, el: HTMLElement, phase: "enter" | "leave"): void {
  const open = phase === "enter";
  if (slot === "overlay") applyModalOverlayInstant(el, open);
  else applyModalPanelInstant(el, open);
}
 
export function useDialogModalMotion({
  open,
  onOpenChange,
  dismissOnBackdrop = true,
  onInteractOutside,
  contained = false,
  motionScope,
}: UseDialogModalMotionProps & { motionScope?: MotionScopeValue | null }) {
  const applyInstant = useCallback(applyDialogHostInstant, []);
  const slotMotion = useModalSlotMotionController({ motionScope, applyInstant });
 
  const motion = useModalMotion({
    open,
    contained,
    onOpenChange,
    dismissOnBackdrop,
    onInteractOutside,
    enableContainedEscape: true,
    slotMotion,
  });
 
  return {
    mounted: motion.mounted,
    showPortal: motion.showPortal,
    dialogRef: motion.dialogRef,
    overlayRef: motion.overlayRef,
    panelRef: motion.panelRef,
    handleBackdropPointerDown: motion.handleBackdropPointerDown,
  };
}
 