import "@/components/core/utils/glossInteractive.css";

import { AlertDialogClassNamesProvider, AlertDialogMotionProvider, AlertDialogProvider } from "./alertDialogContext";
import { AlertDialogBody, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogHeadingBlock, AlertDialogIndicator, AlertDialogPanel, AlertDialogTitle, AlertDialogTrigger } from "./alertDialogParts";
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
  AlertDialogClassNames,
  AlertDialogMotion,
  AlertDialogLifecycleMotion,
  AlertDialogPartMotion,
} from "./alertDialogTypes";

export function AlertDialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  status,
  variant = "default",
  size = "base",
  closeOnEscape = true,
  classNames,
  motion,
  portalContainer,
}: AlertDialogProps) {
  const state = useAlertDialogRootState({
    open,
    defaultOpen,
    onOpenChange,
    status,
    variant,
    size,
    closeOnEscape,
    portalContainer,
  });

  return (
    <AlertDialogClassNamesProvider classNames={classNames}>
      <AlertDialogProvider value={state.contextValue}>
        {/* Root has no DOM. Defaults + host play wrap AlertDialog.Panel. */}
        <AlertDialogMotionProvider motion={motion}>
        {children}
        </AlertDialogMotionProvider>
      </AlertDialogProvider>
    </AlertDialogClassNamesProvider>
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
