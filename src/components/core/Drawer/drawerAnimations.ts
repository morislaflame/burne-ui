import { killMotion } from "@/components/core/utils/gsapMotion";
import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import {
  animateModalClose,
  animateModalOpen,
  applyReducedModalMotion,
  isReducedModalMotion,
} from "@/components/core/utils/modalSurfaceMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import {
  getDrawerSlideInFrom,
  getDrawerSlideInTo,
  getDrawerSlideOutTo,
} from "./drawerAPI";
import type { UseDrawerModalMotionProps } from "./drawerTypes";

export function useDrawerModalMotion({
  open,
  onOpenChange,
  variant,
  placement,
  backdropIsDismissable,
}: UseDrawerModalMotionProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glossPanelRef = useRef<HTMLDivElement>(null);
  const skipCloseAnimRef = useRef(false);

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
      if (!cancelled) setMounted(false);
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
    const vars = { ...motionInteractive(), overwrite: "auto" as const };
    const tl = animateModalClose({
      overlay,
      panel,
      vars,
      onComplete: finishClose,
      panelExit: getDrawerSlideOutTo(placement),
    });

    return () => {
      cancelled = true;
      tl.kill();
      killMotion(overlay, panel);
    };
  }, [open, mounted, placement]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isReducedModalMotion()) {
      applyReducedModalMotion(overlay, panel);
      return;
    }

    animateModalOpen({
      overlay,
      panel,
      vars: { ...motionInteractive(), overwrite: "auto" as const },
      panelFrom: getDrawerSlideInFrom(placement),
      panelTo: getDrawerSlideInTo(placement),
    });
  }, [open, mounted, placement]);

  useLayoutEffect(() => {
    if (!open || !mounted || !panelRef.current) return;
    panelRef.current.focus();
  }, [open, mounted]);

  const handleBackdropMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!backdropIsDismissable) return;
      if (e.target === e.currentTarget) onOpenChange(false);
    },
    [backdropIsDismissable, onOpenChange],
  );

  return {
    mounted,
    dialogRef,
    overlayRef,
    panelRef,
    skipCloseAnimRef,
    bindGlossPanelRef,
    handleBackdropMouseDown,
  };
}
