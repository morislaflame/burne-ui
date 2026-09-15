import "../utils/glossInteractive.css";

import { DrawerClassNamesProvider, DrawerMotionProvider, DrawerProvider } from "./drawerContext";
import { DrawerBackdropInner, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHandleInner, DrawerHeader, DrawerHeadingBlock, DrawerPanel, DrawerTitle, DrawerTrigger } from "./drawerParts";
import type { DrawerProps } from "./drawerTypes";
import { useDrawerRootState } from "./useDrawerRootState";
import { OVERLAY_TRIGGER_MOTION_DEFAULTS } from "@/components/core/utils/overlayTriggerSqueeze";

export type {
  DrawerProps,
  DrawerPanelProps,
  DrawerTriggerProps,
  DrawerPlacement,
  DrawerExtent,
  DrawerSize,
  DrawerVariant,
  DrawerClassNames,
  DrawerBackdropProps,
  DrawerHandleProps,
  DrawerHeaderProps,
  DrawerHeadingBlockProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerCloseProps,
  DrawerContentProps,
  DrawerMotion,
  DrawerLifecycleMotion,
  DrawerPartMotion,
} from "./drawerTypes";

export function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "right",
  size = "base",
  children,
  classNames,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  portalContainer,
}: DrawerProps) {
  const state = useDrawerRootState({
    open,
    defaultOpen,
    onOpenChange,
    placement,
    size,
    portalContainer,
  });

  return (
    <DrawerProvider value={state.contextValue}>
      <DrawerClassNamesProvider classNames={classNames}>
        <DrawerMotionProvider motion={motion} defaults={OVERLAY_TRIGGER_MOTION_DEFAULTS} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
        {children}
        </DrawerMotionProvider>
      </DrawerClassNamesProvider>
    </DrawerProvider>
  );
}

DrawerRoot.displayName = "Drawer";

export {
  DrawerBackdropInner,
  DrawerHandleInner,
  DrawerContent,
  DrawerHeader,
  DrawerHeadingBlock,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
  DrawerPanel,
  DrawerTrigger,
};
