import "../utils/glossInteractive.css";

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
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "./dialogParts";
import type { DialogProps } from "./dialogTypes";
import { useDialogRootState } from "./useDialogRootState";

export type {
  DialogProps,
  DialogPanelProps,
  DialogTriggerProps,
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
  classNames,
}: DialogProps) {
  const state = useDialogRootState({ open, onOpenChange });

  return (
    <DialogProvider value={state.contextValue}>
      <DialogClassNamesProvider classNames={classNames}>
        {children}
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
