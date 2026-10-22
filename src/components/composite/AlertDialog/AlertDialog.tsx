import { AlertDialogClassNamesProvider, AlertDialogMotionProvider, AlertDialogProvider } from "./alertDialogContext";
import { AlertDialogAction, AlertDialogBody, AlertDialogCancel, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogHeadingBlock, AlertDialogIndicator, AlertDialogOverlay, AlertDialogPanel, AlertDialogTitle, AlertDialogTrigger } from "./alertDialogParts";
import type { AlertDialogProps } from "./alertDialogTypes";
import { useAlertDialogRootState } from "./useAlertDialogRootState";
import { OVERLAY_TRIGGER_MOTION_DEFAULTS } from "@/components/core/utils/overlayTriggerSqueeze";
 
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
  variant,
  size = "base",
  closeOnEscape = true,
  closeOnInteractOutside = false,
  onEscapeKeyDown,
  onInteractOutside,
  initialFocus,
  classNames,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
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
    closeOnInteractOutside,
    onEscapeKeyDown,
    onInteractOutside,
    initialFocus,
    portalContainer,
  });
 
  return (
    <AlertDialogClassNamesProvider classNames={classNames}>
      <AlertDialogProvider value={state.contextValue}>
        {/* Root has no DOM. Trigger defaults live here (Trigger is outside Panel). */}
        <AlertDialogMotionProvider motion={motion} defaults={OVERLAY_TRIGGER_MOTION_DEFAULTS} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogOverlay,
  AlertDialogPanel,
  AlertDialogTrigger,
};
 