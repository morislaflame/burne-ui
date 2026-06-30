import { killMotion } from "@/components/core/utils/gsapMotion";
import { motionTooltip } from "@/components/core/utils/motionConfig";
import {
  animatePortalClose,
  animatePortalOpen,
  applyReducedPortalMotion,
  isReducedModalMotion,
} from "@/components/core/utils/modalSurfaceMotion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  focusDropdownMenuItem,
  getFocusableDropdownMenuItems,
} from "./dropdownA11y";
import type {
  UseDropdownPopoverMenuProps,
  UseDropdownSubContentPortalProps,
} from "./dropdownTypes";

export function useDropdownPopoverMenu({
  open,
  setOpen,
  triggerRef,
  contentRef,
}: UseDropdownPopoverMenuProps) {
  useLayoutEffect(() => {
    if (!open) return;
    const panel = contentRef.current;
    if (!panel) return;
    const items = getFocusableDropdownMenuItems(panel);
    items[0]?.focus();
  }, [contentRef, open]);

  useEffect(() => {
    if (!open) return;
    const panel = contentRef.current;
    if (!panel) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
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
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [contentRef, open, setOpen, triggerRef]);
}

export function useDropdownSubContentPortal({
  subOpen,
  triggerRef,
  menuTriggerRef,
  subPanelRootsRef,
  popoverVariant,
}: UseDropdownSubContentPortalProps) {
  const isGlossPanel = popoverVariant === "gloss";
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, minW: 0 });
  const [portalMounted, setPortalMounted] = useState(subOpen);

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
    setPos({ top, left, minW });
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (subOpen) setPortalMounted(true);
  }, [subOpen]);

  useLayoutEffect(() => {
    if (!subOpen) return;
    updatePosition();
  }, [subOpen, updatePosition]);

  useEffect(() => {
    if (!subOpen) return;
    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [subOpen, updatePosition]);

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
  };
}
