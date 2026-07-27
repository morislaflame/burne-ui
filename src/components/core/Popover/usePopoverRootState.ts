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
  portalContainer,
}: UsePopoverRootStateProps) {
  const [open, setOpen] = useControllableOpen(openProp, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(open);
  const autoId = useId();
  const popoverId = `popover-${autoId}`;
  const labelId = popoverLabelId(popoverId);
  const hintId = popoverHintId(popoverId);

  const { labelConnected, hintConnected } = useMemo(
    () => ({
      labelConnected: hasCompoundChild(children, "PopoverTitle"),
      hintConnected: hasCompoundChild(children, "PopoverDescription"),
    }),
    [children],
  );

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

  // Restore focus to trigger/anchor whenever the popover closes (Escape, outside
  // click, trigger toggle) — portaled content unmounts and would otherwise leave
  // focus on <body>.
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      const el = anchorRef?.current ?? triggerRef.current;
      el?.focus({ preventScroll: true });
    }
    wasOpenRef.current = open;
  }, [anchorRef, open, triggerRef]);

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
      portalContainer,
    }),
    [
      anchorRef,
      hintConnected,
      hintId,
      labelConnected,
      labelId,
      open,
      popoverId,
      portalContainer,
      setOpen,
      side,
      size,
      variant,
    ],
  );

  return { contextValue };
}
