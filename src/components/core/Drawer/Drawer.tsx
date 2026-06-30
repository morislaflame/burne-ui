import { createPortal } from "react-dom";

import "../utils/glossInteractive.css";

import { useDrawerModalMotion } from "./drawerAnimations";
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
  DrawerPortalShell,
  DrawerTitle,
} from "./drawerParts";
import type { DrawerContextValue, DrawerProps } from "./drawerTypes";
import { useDrawerRootState } from "./useDrawerRootState";

export type {
  DrawerProps,
  DrawerPlacement,
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
} from "./drawerTypes";

export function DrawerRoot({
  open,
  onOpenChange,
  children,
  placement = "right",
  size = "default",
  variant = "default",
  className,
  classNames,
  themeAnchor,
}: DrawerProps) {
  const state = useDrawerRootState({ open, onOpenChange, themeAnchor, children });
  const motion = useDrawerModalMotion({
    open,
    onOpenChange,
    variant,
    placement,
    backdropIsDismissable: state.backdropIsDismissable,
  });

  const contextValue: DrawerContextValue = {
    ...state.contextBase,
    placement,
    overlayRef: motion.overlayRef,
    panelRef: motion.panelRef,
    skipCloseAnimRef: motion.skipCloseAnimRef,
  };

  if (typeof document === "undefined" || !motion.mounted) return null;

  return createPortal(
    <DrawerProvider value={contextValue}>
      <DrawerClassNamesProvider classNames={classNames}>
        <DrawerPortalShell
          className={className}
          variant={variant}
          placement={placement}
          size={size}
          portalTheme={state.portalTheme}
          lightUi={state.lightUi}
          titleId={state.titleId}
          descriptionId={state.descriptionId}
          hasDescription={state.hasDescription}
          backdropIsDismissable={state.backdropIsDismissable}
          panelSegments={state.panelSegments}
          dialogRef={motion.dialogRef}
          overlayRef={motion.overlayRef}
          panelRef={motion.panelRef}
          bindGlossPanelRef={motion.bindGlossPanelRef}
          onBackdropMouseDown={motion.handleBackdropMouseDown}
          onDialogClose={() => onOpenChange(false)}
        />
      </DrawerClassNamesProvider>
    </DrawerProvider>,
    document.body,
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
};
