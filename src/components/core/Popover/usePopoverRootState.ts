import { useEffect, useId, useMemo, useRef } from "react";
 
import { focusElement } from "@/components/core/utils/focusElement";
import {
  isNodeInChildOverlayLayer,
  overlayShouldClose,
  useRegisterOverlayLayer,
} from "@/components/core/utils/overlayLayer";
import { useSkinVariant } from "@/skins/skinContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
 
import { popoverHintId, popoverLabelId } from "./popoverA11y";
import { useControllableOpen } from "./popoverAPI";
import type { PopoverContextValue, UsePopoverRootStateProps } from "./popoverTypes";

const OUTSIDE_FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  'input:not([type="hidden"]):not([disabled])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
  "label",
].join(",");

function isFocusableOutsideTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const match = target.closest(OUTSIDE_FOCUSABLE_SELECTOR);
  if (!match) return false;
  if (match.closest("[aria-hidden='true'], [inert], [hidden]")) return false;
  return true;
}
 
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
  const closedByPointerOutsideRef = useRef(false);
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

  const layerId = useRegisterOverlayLayer({
    enabled: open,
    kind: "floating",
    onEscape: (dismissEvent) => {
      if (!overlayShouldClose(dismissEvent, onEscapeKeyDown, closeOnEscape)) return true;
      setOpen(false);
      return true;
    },
    containsNode: (node) =>
      Boolean(
        anchorRef?.current?.contains(node) ||
          triggerRef.current?.contains(node) ||
          contentRef.current?.contains(node),
      ),
  });
 
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const anchor = anchorRef?.current ?? triggerRef.current;
      if (anchor?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      if (isNodeInChildOverlayLayer(layerId, target)) return;
      const dismissEvent = {
        target: event.target,
        preventDefault: () => event.preventDefault(),
        get defaultPrevented() {
          return event.defaultPrevented;
        },
      };
      if (!overlayShouldClose(dismissEvent, onInteractOutside, closeOnInteractOutside)) return;
      closedByPointerOutsideRef.current = isFocusableOutsideTarget(event.target);
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchorRef, closeOnInteractOutside, layerId, onInteractOutside, open, setOpen]);
 
  // Restore focus to trigger/anchor when the popover closes (Escape, action
  // close, trigger toggle), unless outside pointerdown targeted another
  // focusable element (e.g. tapping an <input> on mobile).
  useEffect(() => {
    if (open) {
      closedByPointerOutsideRef.current = false;
    } else if (wasOpenRef.current) {
      const skipRestore = closedByPointerOutsideRef.current;
      closedByPointerOutsideRef.current = false;
      if (restoreFocus && !skipRestore) {
        const el = anchorRef?.current ?? triggerRef.current;
        focusElement(el);
      }
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
      layerId,
      portalContainer,
    }),
    [
      anchorRef,
      hintConnected,
      hintId,
      labelConnected,
      labelId,
      layerId,
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
 