/**
 * Enter/leave motion for modal dialogs and portal surfaces.
 *
 * Open: backdrop fades in; panel/surface scales in without opacity on the ancestor
 * (keeps backdrop-filter on gloss children alive from the first frame).
 * Close: backdrop fades with opacity; panel/surface fades out (autoAlpha) + exit transform.
 */

import { gsap as gsapInstance, killMotion } from "./gsapMotion";
import { prefersReducedInteractiveHoverLift } from "./hoverInteractiveLift";

export const MODAL_PANEL_SCALE_FROM = 0.97;

export type GsapMotionVars = NonNullable<Parameters<typeof gsapInstance.to>[1]>;

export function isReducedModalMotion(): boolean {
  return prefersReducedInteractiveHoverLift();
}

/** Initial inline style for modal backdrop overlay before enter animation. */
export function modalOverlayEnterStyle(): { opacity: number } {
  return { opacity: isReducedModalMotion() ? 1 : 0 };
}

/** Skip GSAP and show modal surfaces immediately (reduced motion). */
export function applyReducedModalMotion(
  overlay: HTMLElement | null,
  panel: HTMLElement | null,
  options?: { focusPanel?: boolean },
): void {
  if (overlay) overlay.style.opacity = "1";
  if (panel) {
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
    gsapInstance.set(panel, { scale: 1, clearProps: "transform" });
    if (options?.focusPanel) panel.focus();
  }
}

export function animateModalOpen({
  overlay,
  panel,
  vars,
  panelFrom = { scale: MODAL_PANEL_SCALE_FROM },
  panelTo = { scale: 1 },
}: {
  overlay: HTMLElement;
  panel: HTMLElement;
  vars: GsapMotionVars;
  panelFrom?: GsapMotionVars;
  panelTo?: GsapMotionVars;
}): void {
  killMotion(overlay, panel);
  gsapInstance.fromTo(overlay, { opacity: 0 }, { opacity: 1, ...vars });
  gsapInstance.fromTo(panel, panelFrom, { ...panelTo, ...vars });
}

export function animateModalClose({
  overlay,
  panel,
  vars,
  onComplete,
  panelExit = { autoAlpha: 0, scale: MODAL_PANEL_SCALE_FROM },
}: {
  overlay: HTMLElement;
  panel: HTMLElement;
  vars: GsapMotionVars;
  onComplete: () => void;
  panelExit?: GsapMotionVars;
}) {
  killMotion(overlay, panel);
  const tl = gsapInstance.timeline({ onComplete });
  // opacity, not autoAlpha — visibility:hidden on blur backdrop causes flicker at the end
  tl.to(overlay, { opacity: 0, ...vars }, 0);
  tl.to(panel, { ...panelExit, ...vars }, 0);
  return tl;
}

/** Skip GSAP and reset portal surface (reduced motion). */
export function applyReducedPortalMotion(surface: HTMLElement | null): void {
  if (!surface) return;
  surface.style.opacity = "";
  surface.style.visibility = "";
  gsapInstance.set(surface, { scale: 1, clearProps: "transform" });
}

/** Wrapper stays opaque so gloss backdrop-filter works during enter. */
export function preparePortalSurfaceForEnter(surface: HTMLElement): void {
  surface.style.opacity = "1";
  surface.style.visibility = "visible";
}

export function animatePortalOpen({
  surface,
  vars,
  from = { scale: MODAL_PANEL_SCALE_FROM },
  to = { scale: 1 },
}: {
  surface: HTMLElement;
  vars: GsapMotionVars;
  from?: GsapMotionVars;
  to?: GsapMotionVars;
}): void {
  killMotion(surface);
  preparePortalSurfaceForEnter(surface);
  gsapInstance.fromTo(surface, from, { ...to, ...vars });
}

export function animatePortalClose({
  surface,
  vars,
  onComplete,
  exit = {},
}: {
  surface: HTMLElement;
  vars: GsapMotionVars;
  onComplete?: () => void;
  exit?: GsapMotionVars;
}) {
  killMotion(surface);
  const startOpacity = Number.parseFloat(getComputedStyle(surface).opacity);
  const fromAlpha = Number.isFinite(startOpacity) && startOpacity > 0 ? startOpacity : 1;
  return gsapInstance.fromTo(
    surface,
    { autoAlpha: fromAlpha },
    { autoAlpha: 0, ...exit, ...vars, onComplete },
  );
}

/**
 * Element to restore focus to after the modal closes.
 * Call before `showModal()` — after that, focus moves into the dialog.
 */
export function captureModalFocusReturn(
  dialog: HTMLDialogElement,
): HTMLElement | null {
  const active = typeof document !== "undefined" ? document.activeElement : null;
  if (!(active instanceof HTMLElement)) return null;
  if (active === dialog || dialog.contains(active)) return null;
  return active;
}

/**
 * Close the native dialog before unmounting its portal, then restore focus to
 * the element that opened it. The dialog stays modal during its exit animation,
 * so focus cannot legitimately leave it before this point.
 */
export function completeModalDialogClose({
  dialog,
  focusReturn,
  unmount,
}: {
  dialog: HTMLDialogElement | null;
  focusReturn: HTMLElement | null;
  unmount: () => void;
}): void {
  if (dialog?.open) {
    dialog.close();
  }
  unmount();
  if (focusReturn && document.contains(focusReturn)) {
    focusReturn.focus({ preventScroll: true });
  }
}
