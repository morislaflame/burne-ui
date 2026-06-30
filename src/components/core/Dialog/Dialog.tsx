import { createPortal } from "react-dom";

import "../utils/glossInteractive.css";

import { useDialogModalMotion } from "./dialogAnimations";
import {
  DialogClassNamesProvider,
  DialogProvider,
} from "./dialogContext";
import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeadingBlock,
  DialogPortalShell,
  DialogTitle,
} from "./dialogParts";
import type { DialogProps } from "./dialogTypes";
import { useDialogRootState } from "./useDialogRootState";

export type {
  DialogProps,
  DialogVariant,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
  DialogContentProps,
  DialogHeadingBlockProps,
  DialogClassNames,
} from "./dialogTypes";

export function DialogRoot({
  open,
  onOpenChange,
  children,
  className,
  classNames,
  variant = "default",
  dismissOnBackdrop = true,
  themeAnchor,
}: DialogProps) {
  const state = useDialogRootState({ open, onOpenChange, themeAnchor });
  const motion = useDialogModalMotion({
    open,
    onOpenChange,
    variant,
    dismissOnBackdrop,
  });

  if (typeof document === "undefined" || !motion.mounted) return null;

  return createPortal(
    <DialogProvider value={state.contextValue}>
      <DialogClassNamesProvider classNames={classNames}>
        <DialogPortalShell
          className={className}
          variant={variant}
          portalTheme={state.portalTheme}
          lightUi={state.lightUi}
          titleId={state.titleId}
          descriptionId={state.descriptionId}
          hasDescription={state.hasDescription}
          dialogRef={motion.dialogRef}
          overlayRef={motion.overlayRef}
          panelRef={motion.panelRef}
          bindGlossPanelRef={motion.bindGlossPanelRef}
          onBackdropMouseDown={motion.handleBackdropPointerDown}
          onDialogClose={() => onOpenChange(false)}
        >
          {children}
        </DialogPortalShell>
      </DialogClassNamesProvider>
    </DialogProvider>,
    document.body,
  );
}

DialogRoot.displayName = "Dialog";

export {
  DialogContent,
  DialogHeader,
  DialogHeadingBlock,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogBody,
  DialogFooter,
};
