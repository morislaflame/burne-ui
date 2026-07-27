import { killMotion } from "@/components/core/utils/gsapMotion";
import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import { animateModalClose, animateModalOpen, applyReducedModalMotion, captureModalFocusReturn, completeModalDialogClose, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { motionModal } from "@/components/core/utils/motionConfig";
import { openNativeDialog } from "@/components/core/utils/portalContainer";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";

import type { UseDialogModalMotionProps } from "./dialogTypes";

export function useDialogModalMotion({
  open,
  onOpenChange,
  variant,
  dismissOnBackdrop = true,
  contained = false,
}: UseDialogModalMotionProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glossPanelRef = useRef<HTMLDivElement>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);

  const bindGlossPanelRef = useMemo(
    () => createGlossInteractiveRefCallback(glossPanelRef, variant === "gloss"),
    [variant],
  );

  useLayoutEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!mounted || contained) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, contained]);

  // Non-modal `show()` does not fire `cancel` on Escape — close manually.
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

    if (!overlay || !panel || isReducedModalMotion()) {
      finishClose();
      return undefined;
    }

    killMotion(overlay, panel);
    const vars = { ...motionModal(), overwrite: "auto" as const };
    const tl = animateModalClose({ overlay, panel, vars, onComplete: finishClose });

    return () => {
      cancelled = true;
      tl.kill();
      killMotion(overlay, panel);
    };
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      focusReturnRef.current = captureModalFocusReturn(dialog);
      openNativeDialog(dialog, { contained });
    }

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isReducedModalMotion()) {
      applyReducedModalMotion(overlay, panel, { focusPanel: true });
      return;
    }

    animateModalOpen({
      overlay,
      panel,
      vars: { ...motionModal(), overwrite: "auto" as const },
    });
    panel.focus();
  }, [open, mounted, contained]);

  const handleBackdropPointerDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!dismissOnBackdrop) return;
      if (e.target === e.currentTarget) onOpenChange(false);
    },
    [dismissOnBackdrop, onOpenChange],
  );

  return {
    mounted,
    dialogRef,
    overlayRef,
    panelRef,
    bindGlossPanelRef,
    handleBackdropPointerDown,
  };
}
