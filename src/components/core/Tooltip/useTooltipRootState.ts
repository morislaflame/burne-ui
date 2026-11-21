import { useCallback, useEffect, useId, useMemo, useRef } from "react";
 
import {
  overlayShouldClose,
  useOverlayDelay,
  useRegisterOverlayLayer,
} from "@/components/core/utils/overlayLayer";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useSkinVariant } from "@/skins/skinContext";
 
import type { TooltipContextValue, TooltipProps } from "./tooltipTypes";

const TOOLTIP_HOVER_BRIDGE_MS = 100;
 
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
  const openRef = useRef(open);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest open state for synchronous hover bridge timers
  openRef.current = open;
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pointerOnTriggerRef = useRef(false);
  const pointerOnContentRef = useRef(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();
 
  const clearTimer = useCallback(() => {
    if (showTimerRef.current != null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      pointerOnTriggerRef.current = false;
      pointerOnContentRef.current = false;
    }
  }, [open]);
 
  const scheduleShow = useCallback(() => {
    pointerOnTriggerRef.current = true;
    clearTimer();
    if (openRef.current) return;
    showTimerRef.current = globalThis.setTimeout(() => {
      showTimerRef.current = null;
      setOpen(true);
    }, openDelay);
  }, [clearTimer, openDelay, setOpen]);

  const scheduleBridgeClose = useCallback(() => {
    clearTimer();
    if (!openRef.current) return;
    const bridgeDelay = Math.max(closeDelay, TOOLTIP_HOVER_BRIDGE_MS);
    showTimerRef.current = globalThis.setTimeout(() => {
      showTimerRef.current = null;
      if (pointerOnTriggerRef.current || pointerOnContentRef.current) return;
      setOpen(false);
    }, bridgeDelay);
  }, [clearTimer, closeDelay, setOpen]);

  const leaveTrigger = useCallback(() => {
    pointerOnTriggerRef.current = false;
    scheduleBridgeClose();
  }, [scheduleBridgeClose]);

  const holdContent = useCallback(() => {
    pointerOnContentRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const leaveContent = useCallback(() => {
    pointerOnContentRef.current = false;
    scheduleBridgeClose();
  }, [scheduleBridgeClose]);

  const hide = useCallback(() => {
    clearTimer();
    if (pointerOnContentRef.current || pointerOnTriggerRef.current) return;
    if (closeDelay <= 0) {
      setOpen(false);
      return;
    }
    showTimerRef.current = globalThis.setTimeout(() => {
      showTimerRef.current = null;
      if (pointerOnContentRef.current || pointerOnTriggerRef.current) return;
      setOpen(false);
    }, closeDelay);
  }, [clearTimer, closeDelay, setOpen]);
 
  useEffect(() => () => clearTimer(), [clearTimer]);

  const layerId = useRegisterOverlayLayer({
    enabled: open,
    kind: "floating",
    onEscape: (dismissEvent) => {
      if (!overlayShouldClose(dismissEvent, onEscapeKeyDown, closeOnEscape)) return true;
      pointerOnTriggerRef.current = false;
      pointerOnContentRef.current = false;
      clearTimer();
      setOpen(false);
      return true;
    },
    containsNode: (node) =>
      Boolean(triggerRef.current?.contains(node) || contentRef.current?.contains(node)),
  });
 
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
      contentRef,
      layerId,
      scheduleShow,
      leaveTrigger,
      holdContent,
      leaveContent,
      hide,
      portalContainer,
    }),
    [
      hide,
      holdContent,
      icon,
      layerId,
      leaveContent,
      leaveTrigger,
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
 