import { useEffect, useId, useMemo, useRef } from "react";

import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";

import { popoverHintId, popoverLabelId } from "./popoverA11y";
import { useControllableOpen } from "./popoverAPI";
import type { PopoverContextValue, UsePopoverRootStateProps } from "./popoverTypes";

export function usePopoverRootState({
  children,
  size = "base",
  variant = "default",
  side = "bottom",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  anchorRef,
  shouldDismiss,
}: UsePopoverRootStateProps) {
  const [open, setOpen] = useControllableOpen(openProp, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const autoId = useId();
  const popoverId = `popover-${autoId}`;
  const labelId = popoverLabelId(popoverId);
  const hintId = popoverHintId(popoverId);

  const labelConnected = hasCompoundChild(children, "PopoverLabel");
  const hintConnected = hasCompoundChild(children, "PopoverHint");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const anchor = anchorRef?.current ?? triggerRef.current;
      if (anchor?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      if (shouldDismiss && !shouldDismiss(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchorRef, open, setOpen, shouldDismiss]);

  const contextValue = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      popoverId,
      labelId,
      hintId,
      size,
      variant,
      side,
      labelConnected,
      hintConnected,
      triggerRef,
      anchorRef,
      contentRef,
    }),
    [
      anchorRef,
      hintConnected,
      hintId,
      labelConnected,
      labelId,
      open,
      popoverId,
      setOpen,
      side,
      size,
      variant,
    ],
  );

  return { contextValue };
}
