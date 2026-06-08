import {
  AlertDialogBody,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeadingBlock,
  AlertDialogRoot,
  AlertDialogTitle,
} from "./AlertDialog";

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Header: AlertDialogHeader,
  HeadingBlock: AlertDialogHeadingBlock,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Close: AlertDialogClose,
});

export { footerButtonSizeForAlertDialog } from "./alertDialogFooterUtils";
export { primaryButtonVariantForAlertTone } from "./alertDialogToneUtils";
export { useAlertDialog, type AlertDialogContextValue } from "./useAlertDialog";

export type {
  AlertDialogProps,
  AlertDialogSize,
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogTitleProps,
} from "./alertDialogTypes";
