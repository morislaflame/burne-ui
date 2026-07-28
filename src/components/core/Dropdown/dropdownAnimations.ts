import {
  createTypeaheadBufferState,
  isTypeaheadPrintableKey,
  typeaheadMatchIndex,
  typeaheadPush,
} from "@/components/core/utils/typeahead";
import { focusElement, focusKeyboard } from "@/components/core/utils/focusElement";
import { killMotion } from "@/components/core/utils/gsapMotion";
import { motionTooltip } from "@/components/core/utils/motionConfig";
import { animatePortalClose, animatePortalOpen, applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { isContainedPortal } from "@/components/core/utils/portalContainer";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  dropdownMenuItemTypeaheadLabel,
  focusDropdownMenuItem,
  getFocusableDropdownMenuItems,
} from "./dropdownA11y";
import type {
  UseDropdownPopoverMenuProps,
  UseDropdownSubContentPortalProps,
  UseDropdownSubmenuKeyboardProps,
} from "./dropdownTypes";

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
}: UseDropdownPopoverMenuProps) {
  const typeaheadRef = useRef(createTypeaheadBufferState());

  useLayoutEffect(() => {
    if (!open) return;
    const panel = contentRef.current;
    if (!panel) return;
    const items = getFocusableDropdownMenuItems(panel);
    focusElement(items[0]);
  }, [contentRef, open]);

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
    focusElement(items[0]);
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

    const reduced = isReducedModalMotion();
    let cancelled = false;

    if (reduced) {
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

    killMotion(el);

    if (subOpen) {
      animatePortalOpen({
        surface: el,
        vars: { ...motionTooltip(), overwrite: "auto" },
      });
      return () => {
        cancelled = true;
        killMotion(el);
      };
    }

    const anim = animatePortalClose({
      surface: el,
      vars: { ...motionTooltip(), overwrite: "auto" },
      onComplete: () => {
        if (!cancelled) setPortalMounted(false);
      },
    });
    return () => {
      cancelled = true;
      killMotion(el);
      anim.kill();
    };
  }, [subOpen, portalMounted]);

  return {
    isGlossPanel,
    panelRef,
    pos,
    portalMounted,
    menuTriggerRef,
    contained: isContainedPortal(portalContainer),
  };
}
