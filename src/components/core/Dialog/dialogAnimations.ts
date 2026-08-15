/**
 * Slot motion for Dialog — look here first.
 *
 * DOM slots: `overlay`, `panel`, `title`, `description`, `close`, `header`, `footer`, `content`
 * Host: `Dialog.Panel` (`useDialogModalMotion`) plays `enter` / `leave` and broadcasts
 * nested slots. Root has no DOM — it only passes the `motion` map through context.
 * Defaults wrap the portal host (`DIALOG_MOTION_DEFAULTS` on the Panel provider).
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

import type { DialogMotion, UseDialogModalMotionProps } from "./dialogTypes";

export const DIALOG_MOTION_HOST_SLOTS = ["overlay", "panel"] as const;

export const DIALOG_MOTION_DEFAULTS: DialogMotion = {
  overlay: { enter: "modalOverlayEnter", leave: "modalOverlayLeave" },
  panel: { enter: "modalPanelEnter", leave: "modalPanelLeave" },
};

function applyDialogHostInstant(slot: ModalHostSlot, el: HTMLElement, phase: "enter" | "leave"): void {
  const open = phase === "enter";
  if (slot === "overlay") applyModalOverlayInstant(el, open);
  else applyModalPanelInstant(el, open);
}

export function useDialogModalMotion({
  open,
  onOpenChange,
  variant,
  dismissOnBackdrop = true,
  contained = false,
  motionScope,
}: UseDialogModalMotionProps & { motionScope?: MotionScopeValue | null }) {
  const applyInstant = useCallback(applyDialogHostInstant, []);
  const slotMotion = useModalSlotMotionController({ motionScope, applyInstant });

  const motion = useModalMotion({
    open,
    gloss: variant === "gloss",
    contained,
    onOpenChange,
    dismissOnBackdrop,
    enableContainedEscape: true,
    slotMotion,
  });

  return {
    mounted: motion.mounted,
    showPortal: motion.showPortal,
    dialogRef: motion.dialogRef,
    overlayRef: motion.overlayRef,
    panelRef: motion.panelRef,
    bindGlossPanelRef: motion.bindGlossPanelRef,
    handleBackdropPointerDown: motion.handleBackdropPointerDown,
  };
}
