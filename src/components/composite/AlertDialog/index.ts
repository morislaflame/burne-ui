import {
  AlertDialogBody,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeadingBlock,
  AlertDialogIndicator,
  AlertDialogRoot,
  AlertDialogTitle,
} from "./AlertDialog";

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Header: AlertDialogHeader,
  Indicator: AlertDialogIndicator,
  HeadingBlock: AlertDialogHeadingBlock,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Close: AlertDialogClose,
});

export { footerButtonSizeForAlertDialog } from "./alertDialogFooterUtils";
export {
  primaryButtonVariantForAlertTone,
  primaryButtonStatusForAlertTone,
} from "./alertDialogToneUtils";
export { useAlertDialog, type AlertDialogContextValue } from "./useAlertDialog";

export type {
  AlertDialogProps,
  AlertDialogSize,
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogIndicatorProps,
  AlertDialogTitleProps,
} from "./alertDialogTypes";
