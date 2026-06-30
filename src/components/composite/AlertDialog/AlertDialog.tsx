import "@/components/core/utils/glossInteractive.css";

import { AlertDialogProvider } from "./alertDialogContext";
import {
  AlertDialogBody,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeadingBlock,
  AlertDialogIndicator,
  AlertDialogPanel,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alertDialogParts";
import type { AlertDialogProps } from "./alertDialogTypes";
import { useAlertDialogRootState } from "./useAlertDialogRootState";

export type {
  AlertDialogProps,
  AlertDialogPanelProps,
  AlertDialogTriggerProps,
  AlertDialogSize,
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

export function AlertDialogRoot({
  open,
  onOpenChange,
  children,
  status,
  variant = "default",
  size = "base",
}: AlertDialogProps) {
  const state = useAlertDialogRootState({
    open,
    onOpenChange,
    status,
    variant,
    size,
  });

  return (
    <AlertDialogProvider value={state.contextValue}>{children}</AlertDialogProvider>
  );
}

AlertDialogRoot.displayName = "AlertDialog";

export {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogIndicator,
  AlertDialogHeadingBlock,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogPanel,
  AlertDialogTrigger,
};
