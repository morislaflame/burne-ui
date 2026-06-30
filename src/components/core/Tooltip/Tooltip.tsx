import {
  TooltipClassNamesProvider,
  TooltipContext,
} from "./tooltipContext";
import type { TooltipRootProps } from "./tooltipTypes";
import {
  TooltipArrow,
  TooltipContent,
  TooltipDescription,
  TooltipIndicator,
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
  surface = "default",
  delayShowMs = 240,
  side = "top",
  icon,
  showIcon,
}: TooltipRootProps) {
  const { contextValue } = useTooltipRootState({
    size,
    variant,
    surface,
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
  TooltipIndicator,
  TooltipPanel,
  TooltipTitle,
  TooltipTrigger,
};
