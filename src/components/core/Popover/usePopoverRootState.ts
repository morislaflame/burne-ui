import { useEffect, useId, useMemo, useRef } from "react";
 
import { focusElement } from "@/components/core/utils/focusElement";
import { overlayShouldClose } from "@/components/core/utils/overlayLayer";
import { useSkinVariant } from "@/skins/skinContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
 
import { popoverHintId, popoverLabelId } from "./popoverA11y";
import { useControllableOpen } from "./popoverAPI";
import type { PopoverContextValue, UsePopoverRootStateProps } from "./popoverTypes";
 
export function usePopoverRootState({
  children,
  size = "base",
  variant: variantProp,
  side = "bottom",
  align,
  offset,
  collisionPadding,
  avoidCollisions,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  anchorRef,
  closeOnEscape = true,
  closeOnInteractOutside = true,
  onEscapeKeyDown,
  onInteractOutside,
  restoreFocus = true,
  portalContainer,
}: UsePopoverRootStateProps) {
  const variant = useSkinVariant(variantProp);
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
      if (event.key !== "Escape") return;
      if (!overlayShouldClose(event, onEscapeKeyDown, closeOnEscape)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeOnEscape, onEscapeKeyDown, open, setOpen]);
 
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const anchor = anchorRef?.current ?? triggerRef.current;
      if (anchor?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      const dismissEvent = {
        target: event.target,
        preventDefault: () => event.preventDefault(),
        get defaultPrevented() {
          return event.defaultPrevented;
        },
      };
      if (!overlayShouldClose(dismissEvent, onInteractOutside, closeOnInteractOutside)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchorRef, closeOnInteractOutside, onInteractOutside, open, setOpen]);
 
  // Restore focus to trigger/anchor whenever the popover closes (Escape, outside
  // click, trigger toggle) — portaled content unmounts and would otherwise leave
  // focus on <body>.
  useEffect(() => {
    if (wasOpenRef.current && !open && restoreFocus) {
      const el = anchorRef?.current ?? triggerRef.current;
      focusElement(el);
    }
    wasOpenRef.current = open;
  }, [anchorRef, open, restoreFocus, triggerRef]);
 
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
      align,
      offset,
      collisionPadding,
      avoidCollisions,
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
      align,
      avoidCollisions,
      collisionPadding,
      offset,
      setOpen,
      side,
      size,
      variant,
    ],
  );
 
  return { contextValue };
}
 