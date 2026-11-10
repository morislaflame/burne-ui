import { AlertDialogAction, AlertDialogBody, AlertDialogCancel, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogHeadingBlock, AlertDialogIndicator, AlertDialogOverlay, AlertDialogPanel, AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger } from "./AlertDialog";
 
export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Overlay: AlertDialogOverlay,
  Panel: AlertDialogPanel,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
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
 
export { useAlertDialog, type AlertDialogContextValue } from "./useAlertDialog";
 
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
  AlertDialogMotion,
  AlertDialogLifecycleMotion,
  AlertDialogPartMotion,
} from "./alertDialogTypes";
 