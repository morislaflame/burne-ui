import { createContext, useContext, useMemo } from "react";

import type { TooltipSide } from "./tooltipPosition";
import type {
  TooltipBodyContextValue,
  TooltipClassNames,
  TooltipClassNamesProviderProps,
  TooltipContextValue,
} from "./tooltipTypes";

const TooltipContext = createContext<TooltipContextValue | null>(null);
const TooltipResolvedSideContext = createContext<TooltipSide>("top");
const TooltipBodyContext = createContext<TooltipBodyContextValue | null>(null);
const TooltipClassNamesContext = createContext<TooltipClassNames>({});

export function TooltipClassNamesProvider({
  classNames,
  children,
}: TooltipClassNamesProviderProps) {
  const parent = useContext(TooltipClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <TooltipClassNamesContext.Provider value={merged}>
      {children}
    </TooltipClassNamesContext.Provider>
  );
}

export function useTooltipClassNames(): TooltipClassNames {
  return useContext(TooltipClassNamesContext);
}

export function useTooltipContext(who: string): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error(`${who} must be used inside <Tooltip>.`);
  }
  return ctx;
}

export function useTooltipResolvedSide(): TooltipSide {
  return useContext(TooltipResolvedSideContext);
}

export function useTooltipBodyContext(who: string): TooltipBodyContextValue {
  const ctx = useContext(TooltipBodyContext);
  if (!ctx) {
    throw new Error(`${who} must be inside <Tooltip.Panel> or <Tooltip.Content>.`);
  }
  return ctx;
}

export {
  TooltipBodyContext,
  TooltipContext,
  TooltipResolvedSideContext,
};
