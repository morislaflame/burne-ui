import { useModalMotion } from "@/components/core/utils/useModalMotion";

import type { UseAlertDialogModalMotionProps } from "./alertDialogTypes";

export function useAlertDialogModalMotion({
  open,
  variant,
  contained = false,
}: UseAlertDialogModalMotionProps) {
  const motion = useModalMotion({
    open,
    gloss: variant === "gloss",
    contained,
    // APG: backdrop does not dismiss; Escape is handled on <dialog cancel> via closeOnEscape.
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
