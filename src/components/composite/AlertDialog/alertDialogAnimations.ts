/**
 * Slot motion for AlertDialog — look here first.
 *
 * DOM slots: `overlay`, `panel`, `title`, `description`, `close`, `header`,
 * `footer`, `content`, `body`, `indicator`, plus `trigger` on Root (`headingBlock` is `display: contents`).
 * Host: `AlertDialog.Panel` (`useAlertDialogModalMotion`) plays `enter` / `leave`
 * and broadcasts nested slots. Root has no portal DOM — it passes the `motion` map
 * and trigger defaults. Overlay/panel defaults wrap the portal host (`ALERT_DIALOG_MOTION_DEFAULTS`
 * on the Panel provider).
 *
 * Backdrop does not dismiss (APG). Escape is handled on `<dialog cancel>`.
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
import { KIT_ALERT_VARIANTS, type AlertVariant } from "@/components/core/Alert/alertTypes";

import type { AlertDialogMotion, UseAlertDialogModalMotionProps } from "./alertDialogTypes";

import { bindModalRecipes } from "@/components/core/utils/slotMotion/recipes/bindModal";

bindModalRecipes();
 
export const ALERT_DIALOG_MOTION_HOST_SLOTS = ["overlay", "panel"] as const;
 
export const ALERT_DIALOG_MOTION_DEFAULTS: AlertDialogMotion = {
  overlay: { enter: "modalOverlayEnter", leave: "modalOverlayLeave" },
  panel: { enter: "modalPanelEnter", leave: "modalPanelLeave" },
};

export function resolveAlertDialogMotionDefaults(variant: AlertVariant): AlertDialogMotion {
  return overlaySkinMotion(ALERT_DIALOG_MOTION_DEFAULTS, variant, KIT_ALERT_VARIANTS, "alertDialog");
}
 
function applyAlertDialogHostInstant(
  slot: ModalHostSlot,
  el: HTMLElement,
  phase: "enter" | "leave",
): void {
  const open = phase === "enter";
  if (slot === "overlay") applyModalOverlayInstant(el, open);
  else applyModalPanelInstant(el, open);
}
 
export function useAlertDialogModalMotion({
  open,
  onOpenChange,
  closeOnEscape = true,
  closeOnInteractOutside = false,
  onEscapeKeyDown,
  onInteractOutside,
  initialFocus,
  contained = false,
  motionScope,
}: UseAlertDialogModalMotionProps & { motionScope?: MotionScopeValue | null }) {
  const applyInstant = useCallback(applyAlertDialogHostInstant, []);
  const slotMotion = useModalSlotMotionController({ motionScope, applyInstant });
 
  const motion = useModalMotion({
    open,
    onOpenChange,
    contained,
    closeOnEscape,
    closeOnInteractOutside,
    onEscapeKeyDown,
    onInteractOutside,
    initialFocus,
    enableContainedEscape: true,
    slotMotion,
  });
 
  return {
    mounted: motion.mounted,
    showPortal: motion.showPortal,
    layerId: motion.layerId,
    dialogRef: motion.dialogRef,
    overlayRef: motion.overlayRef,
    panelRef: motion.panelRef,
    handleBackdropPointerDown: motion.handleBackdropPointerDown,
    handleDialogCancel: motion.handleDialogCancel,
  };
}
 