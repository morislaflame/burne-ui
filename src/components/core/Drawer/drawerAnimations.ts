import { gsap } from "@/components/core/utils/gsapMotion";
import type { GsapMotionVars } from "@/components/core/utils/modalSurfaceMotion";
import { useModalMotion } from "@/components/core/utils/useModalMotion";

import { getDrawerSlideCloseTo, getDrawerSlideOpenFrom, getDrawerSlideRest } from "./drawerAPI";
import type { UseDrawerModalMotionProps } from "./drawerTypes";

function prepareDrawerPanel(panel: HTMLElement): void {
  gsap.set(panel, { xPercent: 0, yPercent: 0, x: 0, y: 0 });
}

function getDrawerPanelOpen(panel: HTMLElement, placement: UseDrawerModalMotionProps["placement"]): {
  from: GsapMotionVars;
  to: GsapMotionVars;
} {
  return {
    from: getDrawerSlideOpenFrom(panel, placement),
    to: getDrawerSlideRest(),
  };
}

export function useDrawerModalMotion({
  open,
  onOpenChange,
  variant,
  placement,
  backdropIsDismissable,
  contained = false,
}: UseDrawerModalMotionProps) {
  const motion = useModalMotion({
    open,
    gloss: variant === "gloss",
    contained,
    onOpenChange,
    dismissOnBackdrop: backdropIsDismissable,
    enableContainedEscape: true,
    panelMotionKey: placement,
    preparePanel: prepareDrawerPanel,
    getPanelOpen: (panel) => getDrawerPanelOpen(panel, placement),
    getPanelExit: (panel) => getDrawerSlideCloseTo(panel, placement),
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
