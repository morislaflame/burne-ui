import { useCallback, useEffect, useId, useMemo, useRef } from "react";
 
import { overlayShouldClose, useOverlayDelay } from "@/components/core/utils/overlayLayer";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useSkinVariant } from "@/skins/skinContext";
 
import type { TooltipContextValue, TooltipProps } from "./tooltipTypes";
 
export type UseTooltipRootStateProps = Omit<
  TooltipProps,
  "classNames" | "children" | "motion"
>;
 
export function useTooltipRootState({
  size = "base",
  variant: variantProp,
  status = "default",
  openDelay: openDelayProp,
  closeDelay: closeDelayProp,
  side = "top",
  align,
  offset,
  collisionPadding,
  avoidCollisions,
  closeOnEscape = true,
  onEscapeKeyDown,
  icon,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  portalContainer,
}: UseTooltipRootStateProps) {
  const delays = useOverlayDelay();
  const openDelay = openDelayProp ?? delays.openDelay ?? 240;
  const closeDelay = closeDelayProp ?? delays.closeDelay ?? 0;
  const variant = useSkinVariant(variantProp);
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
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
    }, openDelay);
  }, [clearTimer, openDelay, setOpen]);

  const hide = useCallback(() => {
    clearTimer();
    if (closeDelay <= 0) {
      setOpen(false);
      return;
    }
    showTimerRef.current = globalThis.setTimeout(() => {
      showTimerRef.current = null;
      setOpen(false);
    }, closeDelay);
  }, [clearTimer, closeDelay, setOpen]);
 
  useEffect(() => () => clearTimer(), [clearTimer]);
 
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!overlayShouldClose(e, onEscapeKeyDown, closeOnEscape)) return;
      clearTimer();
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [clearTimer, closeOnEscape, onEscapeKeyDown, open, setOpen]);
 
  const contextValue = useMemo<TooltipContextValue>(
    () => ({
      open,
      tooltipId,
      variant,
      status,
      size,
      side,
      align,
      offset,
      collisionPadding,
      avoidCollisions,
      icon,
      triggerRef,
      scheduleShow,
      hide,
      portalContainer,
    }),
    [
      hide,
      icon,
      open,
      portalContainer,
      scheduleShow,
      align,
      avoidCollisions,
      collisionPadding,
      offset,
      side,
      size,
      status,
      tooltipId,
      variant,
    ],
  );
 
  return { contextValue };
}
 