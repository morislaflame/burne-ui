import { useModalMotion } from "@/components/core/utils/useModalMotion";

import type { UseDialogModalMotionProps } from "./dialogTypes";

export function useDialogModalMotion({
  open,
  onOpenChange,
  variant,
  dismissOnBackdrop = true,
  contained = false,
}: UseDialogModalMotionProps) {
  const motion = useModalMotion({
    open,
    gloss: variant === "gloss",
    contained,
    onOpenChange,
    dismissOnBackdrop,
    enableContainedEscape: true,
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
