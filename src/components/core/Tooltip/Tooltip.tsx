import {
  TooltipClassNamesProvider,
  TooltipContext,
} from "./tooltipContext";
import type { TooltipRootProps } from "./tooltipTypes";
import {
  TooltipArrow,
  TooltipContent,
  TooltipDescription,
  TooltipIcon,
  TooltipIndicator,
  TooltipMessage,
  TooltipPanel,
  TooltipTitle,
  TooltipTrigger,
} from "./tooltipParts";
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
}: TooltipRootProps) {
  const { contextValue } = useTooltipRootState({
    size,
    variant,
    status,
    delayShowMs,
    side,
    icon,
    showIcon,
  });

  return (
    <TooltipClassNamesProvider classNames={classNames}>
      <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>
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
