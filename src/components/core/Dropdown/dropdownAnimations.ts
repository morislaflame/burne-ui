import {
  createTypeaheadBufferState,
  isTypeaheadPrintableKey,
  typeaheadMatchIndex,
  typeaheadPush,
} from "@/components/core/utils/typeahead";
import { useLazyRef } from "@/components/core/utils/useLazyRef";
import { focusKeyboard, focusOnOpen } from "@/components/core/utils/focusElement";
import { killMotion } from "@/components/core/utils/gsapMotion";
import { applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { bindOverlayReflow } from "@/components/core/utils/bindOverlayReflow";
import { isTopmostOverlayLayer } from "@/components/core/utils/overlayLayer";
import { isContainedPortal, resolveFloatingPortalContainer } from "@/components/core/utils/portalContainer";
import { isRtlElement } from "@/components/core/utils/readingDirection";
import type { PopoverMotion } from "@/components/core/Popover";
import { useOptionalPopoverMotionScope } from "@/components/core/Popover/popoverContext";
import {
  hasPointerPhases,
  killMotionScope,
  killStoredMotion,
  mergeMotionSlotMaps,
  mergeMotionRootSiblings,
  splitMotionRootMap,
  useMotionPart,
  useOptionalEnterOnMount,
  waitForLeaveGeneration,
} from "@/components/core/utils/slotMotion";
import type { MotionMapWithEvents } from "@/components/core/utils/slotMotion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
 
import {
  dropdownMenuItemTypeaheadLabel,
  focusDropdownMenuItem,
  getFocusableDropdownMenuItems,
} from "./dropdownA11y";
import { useOptionalDropdownMotionScope } from "./dropdownContext";
import type {
  DropdownMotion,
  DropdownPartMotion,
  DropdownPopoverMotion,
  UseDropdownPopoverMenuProps,
  UseDropdownSubPopoverPortalProps,
  UseDropdownSubmenuKeyboardProps,
} from "./dropdownTypes";

import { bindPortalRecipes } from "@/components/core/utils/slotMotion/recipes/bindPortal";

bindPortalRecipes();
 
/**
 * Slot motion for Dropdown — look here first.
 *
 * Main menu is an embedder: `content` / `title` / `description` / `body` /
 * `item` / `itemLabel` / `itemHint` / `itemIcon` / `label` / `subTrigger` / `separator`
 * are forwarded to Popover (`resolveDropdownPopoverMotion`). Host play lives
 * in `popoverAnimations.ts`. Trigger press is a Dropdown Root slot (`pressSqueeze`).
 *
 * Submenu is a portal host: `subPopover` (`useDropdownSubPopoverPortal` +
 * `DROPDOWN_SUB_MOTION_DEFAULTS` on `Dropdown.SubPopover`). Nested `subTrigger`
 * falls back to the Dropdown scope (Popover context does not reach the portal).
 */
export const DROPDOWN_SUB_MOTION_DEFAULTS: DropdownMotion = {
  subPopover: { enter: "portalSurfaceEnter", leave: "portalSurfaceLeave" },
};
 
export function resolveDropdownPopoverMotion({
  rootMotion,
  popoverMotion,
}: {
  rootMotion?: MotionMapWithEvents<DropdownMotion>;
  popoverMotion?: MotionMapWithEvents<DropdownPopoverMotion>;
}): MotionMapWithEvents<PopoverMotion> | undefined {
  const fromRoot: DropdownPopoverMotion = {};
  if (rootMotion?.content) fromRoot.content = rootMotion.content;
  if (rootMotion?.title) fromRoot.title = rootMotion.title;
  if (rootMotion?.description) fromRoot.description = rootMotion.description;
  if (rootMotion?.body) fromRoot.body = rootMotion.body;
  if (rootMotion?.item) fromRoot.item = rootMotion.item;
  if (rootMotion?.itemLabel) fromRoot.itemLabel = rootMotion.itemLabel;
  if (rootMotion?.itemHint) fromRoot.itemHint = rootMotion.itemHint;
  if (rootMotion?.itemIcon) fromRoot.itemIcon = rootMotion.itemIcon;
  if (rootMotion?.label) fromRoot.label = rootMotion.label;
  if (rootMotion?.subTrigger) fromRoot.subTrigger = rootMotion.subTrigger;
  if (rootMotion?.separator) fromRoot.separator = rootMotion.separator;
  const pickedRoot = Object.keys(fromRoot).length ? fromRoot : undefined;
  const slots = mergeMotionSlotMaps(pickedRoot, popoverMotion) as PopoverMotion | undefined;
  const siblings = mergeMotionRootSiblings(
    splitMotionRootMap(rootMotion),
    splitMotionRootMap(popoverMotion),
  );
  if (!slots && !siblings.events && !siblings.states) return undefined;
  return { ...slots, ...siblings };
}
 
export type DropdownMenuChromeSlot = "label" | "subTrigger" | "separator";
 
export function useDropdownMenuSlotMotion<T extends HTMLElement>(
  slot: DropdownMenuChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: DropdownPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  } = {},
) {
  const popoverScope = useOptionalPopoverMotionScope();
  const dropdownScope = useOptionalDropdownMotionScope();
  const scope = popoverScope ?? dropdownScope;
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(popoverScope ? null : scope, slot, part.targetRef);
  return part;
}
 
function handleDropdownTypeaheadKey(
  e: KeyboardEvent,
  items: HTMLElement[],
  buffer: ReturnType<typeof createTypeaheadBufferState>,
) {
  if (!isTypeaheadPrintableKey(e.key, e)) return false;
  e.preventDefault();
  const labels = items.map(dropdownMenuItemTypeaheadLabel);
  const active = document.activeElement as HTMLElement | null;
  const idx = active ? items.indexOf(active) : -1;
  const next = typeaheadMatchIndex(labels, typeaheadPush(buffer, e.key), idx);
  if (next >= 0) focusDropdownMenuItem(items, next);
  return true;
}
 
export function useDropdownPopoverMenu({
  open,
  contentRef,
  triggerRef,
  openInitialFocusRef,
}: UseDropdownPopoverMenuProps) {
  const typeaheadRef = useLazyRef(createTypeaheadBufferState);

  useLayoutEffect(() => {
    if (!open) return;
    const panel = contentRef.current;
    if (!panel) return;
    const items = getFocusableDropdownMenuItems(panel);
    const edge = openInitialFocusRef?.current ?? "first";
    if (openInitialFocusRef) openInitialFocusRef.current = "first";
    const target = edge === "last" ? items[items.length - 1] : items[0];
    focusOnOpen(target, { from: triggerRef.current });
    target?.scrollIntoView?.({ block: "nearest" });
  }, [contentRef, open, openInitialFocusRef, triggerRef]);
 
  useEffect(() => {
    if (!open) return;
    const panel = contentRef.current;
    if (!panel) return;
    const buffer = typeaheadRef.current;
 
    const onKeyDown = (e: KeyboardEvent) => {
      const items = getFocusableDropdownMenuItems(panel);
      if (items.length === 0) return;
 
      const active = document.activeElement as HTMLElement | null;
      const idx = active ? items.indexOf(active) : -1;
 
      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusDropdownMenuItem(items, idx < items.length - 1 ? idx + 1 : 0);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        focusDropdownMenuItem(items, idx > 0 ? idx - 1 : items.length - 1);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        focusDropdownMenuItem(items, 0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        focusDropdownMenuItem(items, items.length - 1);
        return;
      }
      handleDropdownTypeaheadKey(e, items, buffer);
    };
 
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [contentRef, open, typeaheadRef]);
}
 
/** Keyboard nav inside an open submenu panel (APG menu). */
export function useDropdownSubmenuKeyboard({
  subOpen,
  portalMounted,
  panelRef,
  triggerRef,
  setOpen,
  layerId,
}: UseDropdownSubmenuKeyboardProps) {
  const typeaheadRef = useLazyRef(createTypeaheadBufferState);

  useLayoutEffect(() => {
    if (!subOpen || !portalMounted) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;
    // Focus first item only when opened from the focused trigger (keyboard).
    if (document.activeElement !== trigger) return;
    const items = getFocusableDropdownMenuItems(panel);
    focusOnOpen(items[0], { from: trigger });
    items[0]?.scrollIntoView?.({ block: "nearest" });
  }, [panelRef, portalMounted, subOpen, triggerRef]);
 
  useEffect(() => {
    if (!subOpen || !portalMounted) return;
    const panel = panelRef.current;
    if (!panel) return;
    const buffer = typeaheadRef.current;
 
    const onKeyDown = (e: KeyboardEvent) => {
      const rtl = isRtlElement(panel);
      const closeKey = rtl ? "ArrowRight" : "ArrowLeft";
      if (e.key === closeKey || (e.key === "Escape" && isTopmostOverlayLayer(layerId))) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        focusKeyboard(triggerRef.current);
        return;
      }
 
      const items = getFocusableDropdownMenuItems(panel);
      if (items.length === 0) return;
 
      const active = document.activeElement as HTMLElement | null;
      const idx = active ? items.indexOf(active) : -1;
 
      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusDropdownMenuItem(items, idx < items.length - 1 ? idx + 1 : 0);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        focusDropdownMenuItem(items, idx > 0 ? idx - 1 : items.length - 1);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        focusDropdownMenuItem(items, 0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        focusDropdownMenuItem(items, items.length - 1);
        return;
      }
      handleDropdownTypeaheadKey(e, items, buffer);
    };
 
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [layerId, panelRef, portalMounted, setOpen, subOpen, triggerRef, typeaheadRef]);
}
 
export function useDropdownSubPopoverPortal({
  subOpen,
  triggerRef,
  menuTriggerRef,
  subPanelRootsRef,
  popoverVariant,
  portalContainer,
  motionScope,
}: UseDropdownSubPopoverPortalProps) {
  const config = useMotionConfig();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, minW: 0 });
  const [portalMounted, setPortalMounted] = useState(false);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(() =>
    resolveFloatingPortalContainer(portalContainer, null),
  );
 
  if (subOpen && !portalMounted) {
    setPortalMounted(true);
  }

  const syncPortalHost = useCallback(() => {
    const next = resolveFloatingPortalContainer(
      portalContainer,
      triggerRef.current ?? menuTriggerRef.current,
    );
    setPortalHost((prev) => (prev === next ? prev : next));
    return next;
  }, [menuTriggerRef, portalContainer, triggerRef]);

  useLayoutEffect(() => {
    if (!subOpen && !portalMounted) return;
    syncPortalHost();
  }, [portalMounted, subOpen, syncPortalHost]);

  useEffect(() => {
    if (!subOpen) return;
    syncPortalHost();
  }, [subOpen, syncPortalHost]);
 
  const updatePosition = useCallback(() => {
    const t = triggerRef.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const menu = t.closest("[role='menu']");
    const edge = menu instanceof HTMLElement ? menu.getBoundingClientRect() : r;
    const gap = 0;
    const minW = Math.max(r.width, 10 * 16);
    const panel = panelRef.current;
    const rawW = panel ? (panel.offsetWidth || panel.getBoundingClientRect().width) : 0;
    const pw = Math.max(rawW, minW);
    const ph = panel ? (panel.offsetHeight || panel.getBoundingClientRect().height) : 0;

    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    const vpLeft = vv ? (vv.offsetLeft ?? 0) : 0;
    const vpTop = vv ? (vv.offsetTop ?? 0) : 0;
    const vpRight = vpLeft + (vv ? vv.width : window.innerWidth);
    const vpBottom = vpTop + (vv ? vv.height : window.innerHeight);

    const rtl = isRtlElement(t);
    let left: number;
    if (rtl) {
      left = edge.left - pw - gap;
      if (left < vpLeft + 12) {
        left = edge.right + gap;
      }
    } else {
      left = edge.right + gap;
      if (left + pw > vpRight - 12) {
        left = edge.left - pw - gap;
      }
    }
    const maxLeft = Math.max(vpLeft + 8, vpRight - pw - 8);
    left = Math.max(vpLeft + 8, Math.min(left, maxLeft));

    let top = r.top;
    if (ph > 0) {
      const maxTop = Math.max(vpTop + 8, vpBottom - ph - 8);
      top = Math.max(vpTop + 8, Math.min(top, maxTop));
    } else {
      top = Math.max(vpTop + 8, top);
    }

    const activeHost =
      resolveFloatingPortalContainer(portalContainer, t ?? menuTriggerRef.current) ??
      portalHost;
 
    if (isContainedPortal(activeHost) && activeHost) {
      const hostRect = activeHost.getBoundingClientRect();
      setPos({
        top: top - hostRect.top - activeHost.clientTop + activeHost.scrollTop,
        left: left - hostRect.left - activeHost.clientLeft + activeHost.scrollLeft,
        minW,
      });
      return;
    }
 
    setPos({ top, left, minW });
  }, [menuTriggerRef, portalContainer, portalHost, triggerRef]);
 
  useLayoutEffect(() => {
    if (!subOpen || !portalMounted) return;
    updatePosition();
    const raf = window.requestAnimationFrame(() => updatePosition());
    return () => window.cancelAnimationFrame(raf);
  }, [subOpen, portalMounted, updatePosition]);
 
  useEffect(() => {
    if (!subOpen || !portalMounted) return;
    return bindOverlayReflow(updatePosition);
  }, [subOpen, portalMounted, updatePosition]);
 
  useLayoutEffect(() => {
    const el = panelRef.current;
    const subPanelRoots = subPanelRootsRef.current;
    if (!portalMounted || !el) return;
    subPanelRoots.add(el);
    return () => {
      subPanelRoots.delete(el);
    };
  }, [portalMounted, subPanelRootsRef]);
 
  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = panelRef.current;
    if (!el) return undefined;
 
    if (isReducedModalMotion(config, prefersReducedMotion())) {
      killMotion(el);
      if (subOpen) {
        applyReducedPortalMotion(el);
      } else {
        setPortalMounted(false);
      }
      return undefined;
    }
 
    if (!motionScope) {
      if (!subOpen) setPortalMounted(false);
      return undefined;
    }
 
    if (subOpen) {
      motionScope.play("subPopover", "enter", { el });
      return () => {
        killStoredMotion(el);
      };
    }
 
    const leaveRun = motionScope.play("subPopover", "leave", {
      el,
      waitForComplete: true,
    });
    const leaveWait = waitForLeaveGeneration({
      runs: [leaveRun],
      onComplete: () => setPortalMounted(false),
      onKill: () => {
        killMotionScope(motionScope);
        killStoredMotion(el);
      },
    });
    return () => {
      leaveWait.kill();
    };
  }, [config, subOpen, portalMounted, motionScope]);
 
  const activeHost =
    resolveFloatingPortalContainer(
      portalContainer,
      triggerRef.current ?? menuTriggerRef.current,
    ) ?? portalHost;

  return {
    panelRef,
    pos,
    portalMounted,
    portalHost: activeHost,
    menuTriggerRef,
    contained: isContainedPortal(activeHost),
    popoverVariant,
  };
}
 