import { useCallback, useEffect, useMemo, useRef } from "react";

import { useControllableOpen } from "@/components/core/Popover/popoverAPI";

import { HOVER_CARD_CLOSE_DELAY, HOVER_CARD_OPEN_DELAY } from "./hoverCardTypes";
import type { HoverCardHostContextValue, UseHoverCardRootStateProps } from "./hoverCardTypes";

export function useHoverCardRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  openDelay = HOVER_CARD_OPEN_DELAY,
  closeDelay = HOVER_CARD_CLOSE_DELAY,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
}: UseHoverCardRootStateProps) {
  const [open, setOpen] = useControllableOpen(openProp, defaultOpen, onOpenChange);
  const openRef = useRef(open);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const clearTimers = useCallback(() => {
    if (openTimer.current != null) clearTimeout(openTimer.current);
    if (closeTimer.current != null) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const hold = useCallback(() => {
    clearTimers();
    if (openRef.current) return;
    if (openDelay <= 0) {
      setOpen(true);
      return;
    }
    openTimer.current = setTimeout(() => {
      setOpen(true);
    }, openDelay);
  }, [clearTimers, openDelay, setOpen]);

  const release = useCallback(() => {
    clearTimers();
    if (!openRef.current) return;
    if (closeDelay <= 0) {
      setOpen(false);
      return;
    }
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, closeDelay);
  }, [clearTimers, closeDelay, setOpen]);

  const host = useMemo<HoverCardHostContextValue>(
    () => ({
      hold,
      release,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
    }),
    [hold, motionController, motionPayload, motionState, playInitialState, release],
  );

  return { open, setOpen, host };
}
