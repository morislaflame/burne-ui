import { useRef } from "react";

import { animateGlossInteractivePressSqueeze } from "@/components/core/utils/glossInteractiveMotion";
import { animateInteractivePressSqueeze, prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";

import type { RunSelectOpenAfterSqueezeOptions } from "./selectTypes";

export function runSelectOpenAfterSqueeze({
  anchorRef,
  disabled,
  isGloss,
  groupSegment,
  setOpen,
  onOpened,
  openingRef,
}: RunSelectOpenAfterSqueezeOptions & {
  openingRef: React.RefObject<boolean>;
}) {
  if (disabled || openingRef.current) return;
  openingRef.current = true;
  const el = anchorRef.current;
  if (!el) {
    openingRef.current = false;
    return;
  }
  if (prefersReducedInteractiveHoverLift()) {
    openingRef.current = false;
    setOpen(true);
    onOpened?.();
    return;
  }
  const squeeze =
    isGloss && groupSegment == null
      ? animateGlossInteractivePressSqueeze(el, true)
      : animateInteractivePressSqueeze(el);
  void squeeze.then(() => {
    openingRef.current = false;
    if (disabled) return;
    setOpen(true);
    onOpened?.();
  });
}

export function useSelectOpeningRef() {
  return useRef(false);
}
