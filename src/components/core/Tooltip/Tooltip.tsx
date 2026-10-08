import { TooltipClassNamesProvider, TooltipContext, TooltipMotionProvider } from "./tooltipContext";
import type { TooltipProps } from "./tooltipTypes";
import { TooltipArrow, TooltipContent, TooltipDescription, TooltipIcon, TooltipIndicator, TooltipMessage, TooltipPanel, TooltipTitle, TooltipTrigger } from "./tooltipParts";
import { useTooltipRootState } from "./useTooltipRootState";
 
export function TooltipRoot({
  children,
  classNames,
  size = "base",
  variant,
  status = "default",
  delayShowMs = 240,
  side = "top",
  icon,
  showIcon,
  open,
  defaultOpen,
  onOpenChange,
  portalContainer,
  motion,
  motionState,
  motionPayload,
  playInitialState,
}: TooltipProps) {
  const { contextValue } = useTooltipRootState({
    size,
    variant,
    status,
    delayShowMs,
    side,
    icon,
    showIcon,
    open,
    defaultOpen,
    onOpenChange,
    portalContainer,
  });
 
  return (
    <TooltipClassNamesProvider classNames={classNames}>
      <TooltipMotionProvider
          motion={motion}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
        <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>
      </TooltipMotionProvider>
    </TooltipClassNamesProvider>
  );
}
 
TooltipRoot.displayName = "TooltipRoot";
 
export {
  TooltipArrow,
  TooltipContent,
  TooltipDescription,
  TooltipIcon,
  TooltipIndicator,
  TooltipMessage,
  TooltipPanel,
  TooltipTitle,
  TooltipTrigger,
};
 