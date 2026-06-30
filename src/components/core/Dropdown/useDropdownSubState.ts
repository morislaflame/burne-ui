import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DropdownSubContextValue } from "./dropdownTypes";

export function useDropdownSubState(menuOpen: boolean) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!menuOpen) setOpen(false);
  }, [menuOpen]);

  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = undefined;
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 160);
  }, []);

  const contextValue: DropdownSubContextValue = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      scheduleClose,
      cancelClose,
    }),
    [open, scheduleClose, cancelClose],
  );

  return { contextValue };
}
