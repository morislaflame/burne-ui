import "../utils/glossInteractive.css";

import { DialogClassNamesProvider, DialogMotionProvider, DialogProvider } from "./dialogContext";
import { DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogHeadingBlock, DialogPanel, DialogTitle, DialogTrigger } from "./dialogParts";
import type { DialogProps } from "./dialogTypes";
import { useDialogRootState } from "./useDialogRootState";

export type {
  DialogProps,
  DialogPanelProps,
  DialogTriggerProps,
  DialogVariant,
  DialogSize,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
  DialogContentProps,
  DialogHeadingBlockProps,
  DialogClassNames,
  DialogMotion,
  DialogLifecycleMotion,
  DialogPartMotion,
} from "./dialogTypes";

export function DialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  size = "base",
  children,
  classNames,
  motion,
  portalContainer,
}: DialogProps) {
  const state = useDialogRootState({
    open,
    defaultOpen,
    onOpenChange,
    size,
    portalContainer,
  });

  return (
    <DialogProvider value={state.contextValue}>
      <DialogClassNamesProvider classNames={classNames}>
        {/* Root has no DOM. Defaults + host play wrap Dialog.Panel in dialogAnimations/dialogParts. */}
        <DialogMotionProvider motion={motion}>
        {children}
        </DialogMotionProvider>
      </DialogClassNamesProvider>
    </DialogProvider>
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
  DialogPanel,
  DialogTrigger,
};
