/**
 * Shared lifecycle for native `<dialog>` modals (Dialog, AlertDialog, Drawer):
 * mount while open/closing, body scroll lock, gloss panel bind, enter/leave GSAP,
 * focus capture/restore, optional backdrop dismiss + Escape in contained portals.
 */

import { killMotion } from "./gsapMotion";
import { focusPanelOnOpen, isFocusVisibleElement } from "./focusElement";
import { createGlossInteractiveRefCallback } from "./glossInteractiveMotion";
import {
  animateModalClose,
  animateModalOpen,
  applyReducedModalMotion,
  captureModalFocusReturn,
  completeModalDialogClose,
  flushDialogOpenLayout,
  isReducedModalMotion,
  type GsapMotionVars,
} from "./modalSurfaceMotion";
import { motionModalFor } from "./motionConfig";
import { useMotionConfig } from "./motionConfigContext";
import { openNativeDialog } from "./portalContainer";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";

export type UseModalMotionOptions = {
  open: boolean;
  /** Enables gloss interactive bind on the gloss panel shell. */
  gloss?: boolean;
  /** Custom portal host — `show()` instead of `showModal()`, absolute positioning. */
  contained?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When true, pointerdown on the overlay (target === currentTarget) closes. */
  dismissOnBackdrop?: boolean;
  /**
   * Contained portals use non-modal `show()` — Escape does not fire `cancel`.
   * When true, listen for Escape and call `onOpenChange(false)`.
   */
  enableContainedEscape?: boolean;
  /** Focus the panel after open (default true). */
  focusOnOpen?: boolean;
  /** Override default scale enter; called with the live panel element. */
  getPanelOpen?: (panel: HTMLElement) => {
    from: GsapMotionVars;
    to: GsapMotionVars;
  };
  /** Override default scale+fade exit. */
  getPanelExit?: (panel: HTMLElement) => GsapMotionVars;
  /** Runs before enter animation (e.g. clear leftover Drawer x/y). */
  preparePanel?: (panel: HTMLElement) => void;
  /**
   * Extra open/close effect dependency (e.g. Drawer `placement`) so panel
   * motion resolvers re-run when direction changes while mounted.
   */
  panelMotionKey?: string | number;
  /**
   * When set, enter/leave use this controller instead of `animateModalOpen/Close`.
   * AlertDialog omits it and keeps the existing path.
   */
  slotMotion?: {
    playEnter: (overlay: HTMLElement, panel: HTMLElement) => void;
    playLeave: (
      overlay: HTMLElement,
      panel: HTMLElement,
      onComplete: () => void,
    ) => { kill: () => void };
    cancelEnterFrame?: () => void;
  };
};

export type UseModalMotionResult = {
  mounted: boolean;
  /** `open || mounted` — keep portal in DOM for exit animation. */
  showPortal: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  skipCloseAnimRef: RefObject<boolean>;
  bindGlossPanelRef: (node: HTMLElement | null) => void;
  handleBackdropPointerDown: (e: MouseEvent<HTMLDivElement>) => void;
};

export function useModalMotion({
  open,
  gloss = false,
  contained = false,
  onOpenChange,
  dismissOnBackdrop = false,
  enableContainedEscape = false,
  focusOnOpen = true,
  getPanelOpen,
  getPanelExit,
  preparePanel,
  panelMotionKey,
  slotMotion,
}: UseModalMotionOptions): UseModalMotionResult {
  const config = useMotionConfig();
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glossPanelRef = useRef<HTMLDivElement>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);
  const openFromKeyboardRef = useRef(false);
  const skipCloseAnimRef = useRef(false);
  const enterPlayedKeyRef = useRef<string | null>(null);

  // Keep motion resolvers fresh without retriggering effects on identity churn.
  const getPanelOpenRef = useRef(getPanelOpen);
  const getPanelExitRef = useRef(getPanelExit);
  const preparePanelRef = useRef(preparePanel);
  const slotMotionRef = useRef(slotMotion);
  getPanelOpenRef.current = getPanelOpen;
  getPanelExitRef.current = getPanelExit;
  preparePanelRef.current = preparePanel;
  slotMotionRef.current = slotMotion;

  const showPortal = open || mounted;

  const bindGlossPanelRef = useMemo(
    () => createGlossInteractiveRefCallback(glossPanelRef, gloss),
    [gloss],
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
    if (!open || !contained || !enableContainedEscape || !onOpenChange) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, contained, enableContainedEscape, onOpenChange]);

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

    if (!overlay || !panel || isReducedModalMotion(config)) {
      finishClose();
      return undefined;
    }

    const customLeave = slotMotionRef.current;
    if (customLeave) {
      const handle = customLeave.playLeave(overlay, panel, finishClose);
      return () => {
        cancelled = true;
        handle.kill();
        killMotion(overlay, panel);
      };
    }

    killMotion(overlay, panel);
    const vars = { ...motionModalFor(config), overwrite: "auto" as const };
    const panelExit = getPanelExitRef.current?.(panel);
    const tl = animateModalClose({
      overlay,
      panel,
      vars,
      onComplete: finishClose,
      ...(panelExit ? { panelExit } : {}),
    });

    return () => {
      cancelled = true;
      tl.kill();
      killMotion(overlay, panel);
    };
  }, [config, open, mounted, panelMotionKey]);

  useLayoutEffect(() => {
    if (!open) {
      enterPlayedKeyRef.current = null;
      slotMotionRef.current?.cancelEnterFrame?.();
      return;
    }

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      // Snapshot before showModal — focus moves into the dialog afterwards.
      focusReturnRef.current = captureModalFocusReturn(dialog);
      openFromKeyboardRef.current = isFocusVisibleElement(focusReturnRef.current);
      openNativeDialog(dialog, { contained });
      flushDialogOpenLayout(dialog);
    }

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const enterKey = `${contained ? "c" : "m"}:${String(panelMotionKey ?? "")}`;
    if (enterPlayedKeyRef.current === enterKey) return;

    if (isReducedModalMotion(config)) {
      applyReducedModalMotion(overlay, panel, {
        focusPanel: focusOnOpen,
        focusVisible: openFromKeyboardRef.current,
      });
      enterPlayedKeyRef.current = enterKey;
      return;
    }

    enterPlayedKeyRef.current = enterKey;

    preparePanelRef.current?.(panel);
    const customEnter = slotMotionRef.current;
    if (customEnter) {
      customEnter.playEnter(overlay, panel);
    } else {
      const openMotion = getPanelOpenRef.current?.(panel);
      animateModalOpen({
        overlay,
        panel,
        vars: { ...motionModalFor(config), overwrite: "auto" as const },
        ...(openMotion
          ? { panelFrom: openMotion.from, panelTo: openMotion.to }
          : {}),
      });
    }
    if (focusOnOpen) {
      focusPanelOnOpen(panel, { focusVisible: openFromKeyboardRef.current });
    }
  }, [config, open, mounted, contained, focusOnOpen, panelMotionKey]);

  const handleBackdropPointerDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!dismissOnBackdrop || !onOpenChange) return;
      if (e.target === e.currentTarget) onOpenChange(false);
    },
    [dismissOnBackdrop, onOpenChange],
  );

  return {
    mounted,
    showPortal,
    dialogRef,
    overlayRef,
    panelRef,
    skipCloseAnimRef,
    bindGlossPanelRef,
    handleBackdropPointerDown,
  };
}
