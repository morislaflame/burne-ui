 
import { DialogClassNamesProvider, DialogMotionProvider, DialogProvider } from "./dialogContext";
import { DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogHeadingBlock, DialogPanel, DialogTitle, DialogTrigger } from "./dialogParts";
import type { DialogProps } from "./dialogTypes";
import { useDialogRootState } from "./useDialogRootState";
import { OVERLAY_TRIGGER_MOTION_DEFAULTS } from "@/components/core/utils/overlayTriggerSqueeze";
 
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
  motionController,
  motionState,
  motionPayload,
  playInitialState,
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
        {/* Root has no portal DOM. Trigger defaults live here (Trigger is outside Panel). */}
        <DialogMotionProvider motion={motion} defaults={OVERLAY_TRIGGER_MOTION_DEFAULTS} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
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
 
