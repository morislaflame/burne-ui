import "../utils/glossInteractive.css";

import { PopoverClassNamesProvider, PopoverMotionProvider, PopoverProvider } from "./popoverContext";
import type { PopoverProps } from "./popoverTypes";
import { usePopoverRootState } from "./usePopoverRootState";
import { OVERLAY_TRIGGER_MOTION_DEFAULTS } from "@/components/core/utils/overlayTriggerSqueeze";

export type {
  PopoverArrowProps,
  PopoverBodyProps,
  PopoverClassNames,
  PopoverContentGap,
  PopoverContentProps,
  PopoverHeaderProps,
  PopoverDescriptionProps,
  PopoverTitleProps,
  PopoverProps,
  PopoverSide,
  PopoverSize,
  PopoverTriggerProps,
  PopoverVariant,
  PopoverMotion,
  PopoverLifecycleMotion,
  PopoverPartMotion,
} from "./popoverTypes";

export {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "./popoverParts";

export function PopoverRoot({
  children,
  classNames,
  size = "base",
  variant = "default",
  side = "bottom",
  open,
  defaultOpen = false,
  onOpenChange,
  anchorRef,
  shouldDismiss,
  portalContainer,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
}: PopoverProps) {
  const { contextValue } = usePopoverRootState({
    children,
    size,
    variant,
    side,
    open,
    defaultOpen,
    onOpenChange,
    anchorRef,
    shouldDismiss,
    portalContainer,
  });

  return (
    <PopoverProvider value={contextValue}>
      <PopoverClassNamesProvider classNames={classNames}>
        <PopoverMotionProvider motion={motion} defaults={OVERLAY_TRIGGER_MOTION_DEFAULTS} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
        {children}
        </PopoverMotionProvider>
      </PopoverClassNamesProvider>
    </PopoverProvider>
  );
}

PopoverRoot.displayName = "PopoverRoot";
