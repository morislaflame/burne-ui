import { AlertDialogBody, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogHeadingBlock, AlertDialogIndicator, AlertDialogPanel, AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger } from "./AlertDialog";

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Panel: AlertDialogPanel,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Indicator: AlertDialogIndicator,
  HeadingBlock: AlertDialogHeadingBlock,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Close: AlertDialogClose,
});

export {
  primaryButtonVariantForAlertTone,
  primaryButtonStatusForAlertTone,
} from "./alertDialogAPI";
export { useAlertDialog, type AlertDialogContextValue } from "./useAlertDialog";
export { footerButtonSizeForAlertDialog } from "./alertDialogStyles";

export type {
  AlertDialogProps,
  AlertDialogPanelProps,
  AlertDialogTriggerProps,
  AlertDialogSize,
  AlertDialogClassNames,
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogIndicatorProps,
  AlertDialogTitleProps,
  AlertDialogContentProps,
  AlertDialogHeadingBlockProps,
} from "./alertDialogTypes";
