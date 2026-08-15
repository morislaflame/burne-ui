import { TooltipClassNamesProvider, TooltipContext, TooltipMotionProvider } from "./tooltipContext";
import type { TooltipProps } from "./tooltipTypes";
import { TooltipArrow, TooltipContent, TooltipDescription, TooltipIcon, TooltipIndicator, TooltipMessage, TooltipPanel, TooltipTitle, TooltipTrigger } from "./tooltipParts";
import { useTooltipRootState } from "./useTooltipRootState";

export function TooltipRoot({
  children,
  classNames,
  size = "base",
  variant = "default",
  status = "default",
  delayShowMs = 240,
  side = "top",
  icon,
  showIcon,
  portalContainer,
  motion,
}: TooltipProps) {
  const { contextValue } = useTooltipRootState({
    size,
    variant,
    status,
    delayShowMs,
    side,
    icon,
    showIcon,
    portalContainer,
  });

  return (
    <TooltipClassNamesProvider classNames={classNames}>
      <TooltipMotionProvider motion={motion}>
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
