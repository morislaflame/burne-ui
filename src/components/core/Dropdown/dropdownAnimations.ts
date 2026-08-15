import {
  createTypeaheadBufferState,
  isTypeaheadPrintableKey,
  typeaheadMatchIndex,
  typeaheadPush,
} from "@/components/core/utils/typeahead";
import { focusKeyboard, focusOnOpen } from "@/components/core/utils/focusElement";
import { killMotion } from "@/components/core/utils/gsapMotion";
import { applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { isContainedPortal } from "@/components/core/utils/portalContainer";
import type { PopoverMotion } from "@/components/core/Popover";
import {
  killMotionTargets,
  killStoredMotion,
  mergeMotionSlotMaps,
} from "@/components/core/utils/slotMotion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  dropdownMenuItemTypeaheadLabel,
  focusDropdownMenuItem,
  getFocusableDropdownMenuItems,
} from "./dropdownA11y";
import type {
  DropdownMotion,
  DropdownPopoverMotion,
  UseDropdownPopoverMenuProps,
  UseDropdownSubContentPortalProps,
  UseDropdownSubmenuKeyboardProps,
} from "./dropdownTypes";

/**
 * Slot motion for Dropdown — look here first.
 *
 * Main menu is an embedder: `content` / `title` / `description` / `body` are
 * forwarded to Popover (`resolveDropdownPopoverMotion`). Host play lives in
 * `popoverAnimations.ts`. Trigger squeeze stays `runOpenAfterSqueeze`.
 *
 * Submenu is a portal host: `subContent` (`useDropdownSubContentPortal` +
 * `DROPDOWN_SUB_MOTION_DEFAULTS` on `Dropdown.SubContent`).
 */
export const DROPDOWN_SUB_MOTION_DEFAULTS: DropdownMotion = {
  subContent: { enter: "portalSurfaceEnter", leave: "portalSurfaceLeave" },
};

export function resolveDropdownPopoverMotion({
  rootMotion,
  popoverMotion,
}: {
  rootMotion?: DropdownMotion;
  popoverMotion?: DropdownPopoverMotion;
}): PopoverMotion | undefined {
  const fromRoot: DropdownPopoverMotion = {};
  if (rootMotion?.content) fromRoot.content = rootMotion.content;
  if (rootMotion?.title) fromRoot.title = rootMotion.title;
  if (rootMotion?.description) fromRoot.description = rootMotion.description;
  if (rootMotion?.body) fromRoot.body = rootMotion.body;
  const pickedRoot = Object.keys(fromRoot).length ? fromRoot : undefined;
  return mergeMotionSlotMaps(pickedRoot, popoverMotion) as PopoverMotion | undefined;
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
  setOpen,
  contentRef,
  triggerRef,
}: UseDropdownPopoverMenuProps) {
  const typeaheadRef = useRef(createTypeaheadBufferState());

  useLayoutEffect(() => {
    if (!open) return;
    const panel = contentRef.current;
    if (!panel) return;
    const items = getFocusableDropdownMenuItems(panel);
    focusOnOpen(items[0], { from: triggerRef.current });
  }, [contentRef, open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const panel = contentRef.current;
    if (!panel) return;
    const buffer = typeaheadRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // setOpen restores focus on the trigger (browser decides ring from last input).
        setOpen(false);
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
  }, [contentRef, open, setOpen]);
}

/** Keyboard nav inside an open submenu panel (APG menu). */
export function useDropdownSubmenuKeyboard({
  subOpen,
  portalMounted,
  panelRef,
  triggerRef,
  setOpen,
}: UseDropdownSubmenuKeyboardProps) {
  const typeaheadRef = useRef(createTypeaheadBufferState());

  useLayoutEffect(() => {
    if (!subOpen || !portalMounted) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;
    // Focus first item only when opened from the focused trigger (keyboard).
    if (document.activeElement !== trigger) return;
    const items = getFocusableDropdownMenuItems(panel);
    focusOnOpen(items[0], { from: trigger });
  }, [panelRef, portalMounted, subOpen, triggerRef]);

  useEffect(() => {
    if (!subOpen || !portalMounted) return;
    const panel = panelRef.current;
    if (!panel) return;
    const buffer = typeaheadRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "ArrowLeft") {
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
  }, [panelRef, portalMounted, setOpen, subOpen, triggerRef]);
}

export function useDropdownSubContentPortal({
  subOpen,
  triggerRef,
  menuTriggerRef,
  subPanelRootsRef,
  popoverVariant,
  portalContainer,
  motionScope,
}: UseDropdownSubContentPortalProps) {
  const isGlossPanel = popoverVariant === "gloss";
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, minW: 0 });
  const [portalMounted, setPortalMounted] = useState(false);

  if (subOpen && !portalMounted) {
    setPortalMounted(true);
  }

  const updatePosition = useCallback(() => {
    const t = triggerRef.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const gap = 6;
    const minW = Math.max(r.width, 10 * 16);
    let left = r.right + gap;
    let top = r.top;
    const estW = minW;
    if (left + estW > window.innerWidth - 12) {
      left = Math.max(12, r.left - estW - gap);
    }
    const panel = panelRef.current;
    const ph = panel?.offsetHeight ?? 0;
    if (ph > 0 && top + ph > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - ph - 8);
    }

    if (isContainedPortal(portalContainer) && portalContainer) {
      const hostRect = portalContainer.getBoundingClientRect();
      setPos({
        top: top - hostRect.top + portalContainer.scrollTop,
        left: left - hostRect.left + portalContainer.scrollLeft,
        minW,
      });
      return;
    }

    setPos({ top, left, minW });
  }, [portalContainer, triggerRef]);

  useLayoutEffect(() => {
    if (!subOpen || !portalMounted) return;
    updatePosition();
    const raf = window.requestAnimationFrame(() => updatePosition());
    return () => window.cancelAnimationFrame(raf);
  }, [subOpen, portalMounted, updatePosition]);

  useEffect(() => {
    if (!subOpen || !portalMounted) return;
    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
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

    let cancelled = false;

    if (isReducedModalMotion()) {
      killMotion(el);
      if (subOpen) {
        applyReducedPortalMotion(el);
      } else {
        setPortalMounted(false);
      }
      return () => {
        cancelled = true;
      };
    }

    if (!motionScope) {
      if (!subOpen) setPortalMounted(false);
      return () => {
        cancelled = true;
      };
    }

    if (subOpen) {
      motionScope.play("subContent", "enter", { el });
      return () => {
        cancelled = true;
        killStoredMotion(el);
      };
    }

    const leaveRun = motionScope.play("subContent", "leave", {
      el,
      waitForComplete: true,
    });
    void leaveRun.finished.then(() => {
      if (!cancelled) setPortalMounted(false);
    });
    return () => {
      cancelled = true;
      leaveRun.animation?.kill();
      killMotionTargets(motionScope.getTargets());
      killStoredMotion(el);
    };
  }, [subOpen, portalMounted, motionScope]);

  return {
    isGlossPanel,
    panelRef,
    pos,
    portalMounted,
    menuTriggerRef,
    contained: isContainedPortal(portalContainer),
  };
}
