/**
 * Shared lifecycle for native `<dialog>` modals (Dialog, AlertDialog, Drawer):
 * mount while open/closing, body scroll lock, enter/leave GSAP,
 * focus capture/restore, optional backdrop dismiss + Escape in contained portals.
 */
 
import { lockBodyScroll, unlockBodyScroll } from "./bodyScrollLock";
import { shouldHandleContainedEscape } from "./containedEscape";
import { killMotion } from "./gsapMotion";
import { focusOnOpen, focusPanelOnOpen, isFocusVisibleElement } from "./focusElement";
import { overlayShouldClose, type OverlayDismissEvent } from "./overlayLayer";
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
import { prefersReducedMotion } from "./reducedMotion";
import { useMotionConfig } from "./motionConfigContext";
import { openNativeDialog } from "./portalContainer";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
 
export type UseModalMotionOptions = {
  open: boolean;
  /** Custom portal host — `show()` instead of `showModal()`, absolute positioning. */
  contained?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When true, pointerdown on the overlay (target === currentTarget) closes.
   */
  closeOnInteractOutside?: boolean;
  /** Escape closes. Default true. `onEscapeKeyDown` may `preventDefault()`. */
  closeOnEscape?: boolean;
  onEscapeKeyDown?: (event: OverlayDismissEvent) => void;
  /**
   * Overlay pointerdown (backdrop). Call `event.preventDefault()` to keep the
   * modal open. `closeOnInteractOutside={false}` still skips close.
   */
  onInteractOutside?: (event: OverlayDismissEvent) => void;
  /** Focus this node on open instead of the first tab stop in the panel. */
  initialFocus?: RefObject<HTMLElement | null> | null;
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
  handleBackdropPointerDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleDialogCancel: (event: OverlayDismissEvent) => void;
};

export function useModalMotion({
  open,
  contained = false,
  onOpenChange,
  closeOnInteractOutside = false,
  closeOnEscape = true,
  onEscapeKeyDown,
  onInteractOutside,
  initialFocus = null,
  enableContainedEscape = false,
  focusOnOpen: shouldFocusOnOpen = true,
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
  const focusReturnRef = useRef<HTMLElement | null>(null);
  const openFromKeyboardRef = useRef(false);
  const skipCloseAnimRef = useRef(false);
  const enterPlayedKeyRef = useRef<string | null>(null);
 
  // Keep motion resolvers fresh without retriggering effects on identity churn.
  const getPanelOpenRef = useRef(getPanelOpen);
  const getPanelExitRef = useRef(getPanelExit);
  const preparePanelRef = useRef(preparePanel);
  const slotMotionRef = useRef(slotMotion);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  getPanelOpenRef.current = getPanelOpen;
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  getPanelExitRef.current = getPanelExit;
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  preparePanelRef.current = preparePanel;
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  slotMotionRef.current = slotMotion;
 
  const showPortal = open || mounted;

  useLayoutEffect(() => {
    if (open) {
      skipCloseAnimRef.current = false;
      setMounted(true);
    }
  }, [open]);
 
  useLayoutEffect(() => {
    if (!showPortal || contained) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [showPortal, contained]);
 
  useEffect(() => {
    if (!open || !contained || !enableContainedEscape || !onOpenChange) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!shouldHandleContainedEscape(e, dialogRef.current)) return;
      e.preventDefault();
      if (!overlayShouldClose(e, onEscapeKeyDown, closeOnEscape)) return;
      onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, contained, enableContainedEscape, closeOnEscape, onEscapeKeyDown, onOpenChange]);
 
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
 
    if (!overlay || !panel || isReducedModalMotion(config, prefersReducedMotion())) {
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
 
    if (isReducedModalMotion(config, prefersReducedMotion())) {
      applyReducedModalMotion(overlay, panel, {
        focusPanel: shouldFocusOnOpen && !initialFocus?.current,
        focusVisible: openFromKeyboardRef.current,
      });
      if (shouldFocusOnOpen && initialFocus?.current) {
        focusOnOpen(initialFocus.current, { focusVisible: openFromKeyboardRef.current });
      }
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
    if (shouldFocusOnOpen) {
      const preferred = initialFocus?.current;
      if (preferred) {
        focusOnOpen(preferred, { focusVisible: openFromKeyboardRef.current });
      } else {
        focusPanelOnOpen(panel, { focusVisible: openFromKeyboardRef.current });
      }
    }
  }, [config, open, mounted, contained, shouldFocusOnOpen, initialFocus, panelMotionKey]);
 
  const handleBackdropPointerDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (!overlayShouldClose(e, onInteractOutside, closeOnInteractOutside)) return;
      onOpenChange?.(false);
    },
    [closeOnInteractOutside, onInteractOutside, onOpenChange],
  );

  const handleDialogCancel = useCallback(
    (event: OverlayDismissEvent) => {
      // The host preventDefault stops the native dialog from closing before leave.
      // Only preventDefault inside onEscapeKeyDown keeps the overlay open.
      let userPrevented = false;
      const userEvent: OverlayDismissEvent = {
        preventDefault() {
          userPrevented = true;
        },
        get defaultPrevented() {
          return userPrevented;
        },
        target: event.target,
      };
      event.preventDefault();
      if (!overlayShouldClose(userEvent, onEscapeKeyDown, closeOnEscape)) return;
      onOpenChange?.(false);
    },
    [closeOnEscape, onEscapeKeyDown, onOpenChange],
  );
 
  return {
    mounted,
    showPortal,
    dialogRef,
    overlayRef,
    panelRef,
    skipCloseAnimRef,
    handleBackdropPointerDown,
    handleDialogCancel,
  };
}
 