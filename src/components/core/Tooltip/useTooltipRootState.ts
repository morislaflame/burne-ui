import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import type { TooltipContextValue, TooltipRootProps } from "./tooltipTypes";

export type UseTooltipRootStateProps = Omit<TooltipRootProps, "classNames" | "children">;

export function useTooltipRootState({
  size = "base",
  variant = "default",
  status = "default",
  delayShowMs = 240,
  side = "top",
  icon,
  showIcon,
}: UseTooltipRootStateProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (showTimerRef.current != null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const scheduleShow = useCallback(() => {
    clearTimer();
    showTimerRef.current = globalThis.setTimeout(() => {
      showTimerRef.current = null;
      setOpen(true);
    }, delayShowMs);
  }, [clearTimer, delayShowMs]);

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hide, open]);

  const contextValue = useMemo<TooltipContextValue>(
    () => ({
      open,
      tooltipId,
      variant,
      status,
      size,
      side,
      icon,
      showIcon,
      triggerRef,
      scheduleShow,
      hide,
    }),
    [hide, icon, open, scheduleShow, showIcon, side, size, status, tooltipId, variant],
  );

  return { contextValue };
}
