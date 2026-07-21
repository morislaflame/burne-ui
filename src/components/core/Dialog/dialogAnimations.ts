import { killMotion } from "@/components/core/utils/gsapMotion";
import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import { animateModalClose, animateModalOpen, applyReducedModalMotion, captureModalFocusReturn, completeModalDialogClose, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";

import type { UseDialogModalMotionProps } from "./dialogTypes";

export function useDialogModalMotion({
  open,
  onOpenChange,
  variant,
  dismissOnBackdrop = true,
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
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

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
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
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
      dialog.showModal();
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
      vars: { ...motionInteractive(), overwrite: "auto" as const },
    });
    panel.focus();
  }, [open, mounted]);

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
