import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import { applyReducedModalMotion, captureModalFocusReturn, completeModalDialogClose, isReducedModalMotion, type GsapMotionVars } from "@/components/core/utils/modalSurfaceMotion";
import { motionModal } from "@/components/core/utils/motionConfig";
import { openNativeDialog } from "@/components/core/utils/portalContainer";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";

import { getDrawerSlideCloseTo, getDrawerSlideOpenFrom, getDrawerSlideRest } from "./drawerAPI";
import type { DrawerPlacement, UseDrawerModalMotionProps } from "./drawerTypes";

function resetDrawerPanelTransform(panel: HTMLElement): void {
  gsap.set(panel, { xPercent: 0, yPercent: 0, x: 0, y: 0 });
}

function animateDrawerOpen({
  overlay,
  panel,
  placement,
  vars,
}: {
  overlay: HTMLElement;
  panel: HTMLElement;
  placement: DrawerPlacement;
  vars: GsapMotionVars;
}): void {
  killMotion(overlay, panel);
  resetDrawerPanelTransform(panel);
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, ...vars });
  gsap.fromTo(
    panel,
    getDrawerSlideOpenFrom(panel, placement),
    { ...getDrawerSlideRest(), ...vars },
  );
}

function animateDrawerClose({
  overlay,
  panel,
  placement,
  vars,
  onComplete,
}: {
  overlay: HTMLElement;
  panel: HTMLElement;
  placement: DrawerPlacement;
  vars: GsapMotionVars;
  onComplete: () => void;
}) {
  killMotion(overlay, panel);
  const tl = gsap.timeline({ onComplete });
  tl.to(overlay, { opacity: 0, ...vars }, 0);
  tl.to(panel, { ...getDrawerSlideCloseTo(panel, placement), ...vars }, 0);
  return tl;
}

export function useDrawerModalMotion({
  open,
  onOpenChange,
  variant,
  placement,
  backdropIsDismissable,
  contained = false,
}: UseDrawerModalMotionProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glossPanelRef = useRef<HTMLDivElement>(null);
  const skipCloseAnimRef = useRef(false);
  const focusReturnRef = useRef<HTMLElement | null>(null);

  const showPortal = open || mounted;

  const bindGlossPanelRef = useMemo(
    () => createGlossInteractiveRefCallback(glossPanelRef, variant === "gloss"),
    [variant],
  );

  useLayoutEffect(() => {
    if (open) {
      skipCloseAnimRef.current = false;
      setMounted(true);
    }
  }, [open]);

  useEffect(() => {
    if (!showPortal || contained) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showPortal, contained]);

  useEffect(() => {
    if (!open || !contained) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, contained, onOpenChange]);

  useLayoutEffect(() => {
    if (open || !mounted) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    let cancelled = false;

    const finishClose = () => {
      if (cancelled) return;
      completeModalDialogClose({
        dialog: dialogRef.current,
        focusReturn: focusReturnRef.current,
        unmount: () => setMounted(false),
      });
      focusReturnRef.current = null;
    };

    if (skipCloseAnimRef.current) {
      skipCloseAnimRef.current = false;
      finishClose();
      return undefined;
    }

    if (!overlay || !panel || isReducedModalMotion()) {
      finishClose();
      return undefined;
    }

    killMotion(overlay, panel);
    const vars = { ...motionModal(), overwrite: "auto" as const };
    const tl = animateDrawerClose({
      overlay,
      panel,
      placement,
      vars,
      onComplete: finishClose,
    });

    return () => {
      cancelled = true;
      tl.kill();
      killMotion(overlay, panel);
    };
  }, [open, mounted, placement]);

  useLayoutEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      focusReturnRef.current = captureModalFocusReturn(dialog);
      openNativeDialog(dialog, { contained });
    }

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isReducedModalMotion()) {
      applyReducedModalMotion(overlay, panel);
      return;
    }

    animateDrawerOpen({
      overlay,
      panel,
      placement,
      vars: { ...motionModal(), overwrite: "auto" as const },
    });
  }, [open, placement, contained]);

  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    panelRef.current.focus();
  }, [open]);

  const handleBackdropMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!backdropIsDismissable) return;
      if (e.target === e.currentTarget) onOpenChange(false);
    },
    [backdropIsDismissable, onOpenChange],
  );

  return {
    showPortal,
    mounted,
    dialogRef,
    overlayRef,
    panelRef,
    skipCloseAnimRef,
    bindGlossPanelRef,
    handleBackdropMouseDown,
  };
}
