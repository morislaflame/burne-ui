import "../utils/glossInteractive.css";

import {
  DrawerClassNamesProvider,
  DrawerProvider,
} from "./drawerContext";
import {
  DrawerBackdropInner,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandleInner,
  DrawerHeader,
  DrawerHeadingBlock,
  DrawerPanel,
  DrawerTitle,
  DrawerTrigger,
} from "./drawerParts";
import type { DrawerProps } from "./drawerTypes";
import { useDrawerRootState } from "./useDrawerRootState";

export type {
  DrawerProps,
  DrawerPanelProps,
  DrawerTriggerProps,
  DrawerPlacement,
  DrawerExtent,
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
} from "./drawerTypes";

export function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "right",
  children,
  classNames,
}: DrawerProps) {
  const state = useDrawerRootState({ open, defaultOpen, onOpenChange, placement });

  return (
    <DrawerProvider value={state.contextValue}>
      <DrawerClassNamesProvider classNames={classNames}>
        {children}
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
