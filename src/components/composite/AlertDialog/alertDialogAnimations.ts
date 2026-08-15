/**
 * Slot motion for AlertDialog — look here first.
 *
 * DOM slots: `overlay`, `panel`, `title`, `description`, `close`, `header`,
 * `footer`, `content`, `indicator`
 * Host: `AlertDialog.Panel` (`useAlertDialogModalMotion`) plays `enter` / `leave`
 * and broadcasts nested slots. Root has no DOM — it only passes the `motion` map
 * through context. Defaults wrap the portal host (`ALERT_DIALOG_MOTION_DEFAULTS`
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

import type { AlertDialogMotion, UseAlertDialogModalMotionProps } from "./alertDialogTypes";

export const ALERT_DIALOG_MOTION_HOST_SLOTS = ["overlay", "panel"] as const;

export const ALERT_DIALOG_MOTION_DEFAULTS: AlertDialogMotion = {
  overlay: { enter: "modalOverlayEnter", leave: "modalOverlayLeave" },
  panel: { enter: "modalPanelEnter", leave: "modalPanelLeave" },
};

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
  variant,
  contained = false,
  motionScope,
}: UseAlertDialogModalMotionProps & { motionScope?: MotionScopeValue | null }) {
  const applyInstant = useCallback(applyAlertDialogHostInstant, []);
  const slotMotion = useModalSlotMotionController({ motionScope, applyInstant });

  const motion = useModalMotion({
    open,
    gloss: variant === "gloss",
    contained,
    // APG: backdrop does not dismiss; Escape is handled on <dialog cancel> via closeOnEscape.
    slotMotion,
  });

  return {
    mounted: motion.mounted,
    showPortal: motion.showPortal,
    dialogRef: motion.dialogRef,
    overlayRef: motion.overlayRef,
    panelRef: motion.panelRef,
    bindGlossPanelRef: motion.bindGlossPanelRef,
  };
}
