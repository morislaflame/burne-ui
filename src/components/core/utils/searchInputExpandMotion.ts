import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractiveFor, resolveMotionConfig, type MotionConfig } from "@/components/core/utils/motionConfig";
import type { MotionTransformVars } from "@/components/core/utils/slotMotion/slotMotionTypes";

export type SearchExpandMetrics = {
  targetW: number;
  collapsedDim: number;
  expandedRadius: number;
  padX: number;
  iconBox: number;
  iconLeftCollapsedCss: string;
};

type FlipBox = { left: number; width: number };

const shellFlipBox = new WeakMap<HTMLElement, FlipBox>();

function shellHorizontalBorderPx(shellEl: HTMLElement): number {
  return shellEl.offsetWidth - shellEl.clientWidth;
}

export function iconLeftCollapsedPx(
  metrics: SearchExpandMetrics,
  borderPx: number,
): number {
  return (metrics.collapsedDim - borderPx - metrics.iconBox) / 2;
}

function readBox(el: HTMLElement, fallbackWidth: number): FlipBox {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left,
    width: rect.width > 0 ? rect.width : fallbackWidth,
  };
}

function applySearchShellLayout(el: HTMLElement, open: boolean, metrics: SearchExpandMetrics): void {
  if (open) {
    el.style.width = `${metrics.targetW}px`;
  } else {
    el.style.removeProperty("width");
  }
  el.style.removeProperty("height");
}

function clearShellFlip(el: HTMLElement): void {
  gsap.set(el, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    clearProps: "transformOrigin,borderRadius",
    force3D: false,
  });
}

function clearIconFlip(iconEl: HTMLElement): void {
  gsap.set(iconEl, { x: 0, scaleX: 1, force3D: false });
}

function applyIconLayout(
  iconEl: HTMLElement,
  open: boolean,
  metrics: SearchExpandMetrics,
): void {
  iconEl.style.left = open ? `${metrics.padX}px` : metrics.iconLeftCollapsedCss;
}

function recordShellFlipBox(el: HTMLElement, open: boolean, metrics: SearchExpandMetrics): void {
  shellFlipBox.set(el, readBox(el, open ? metrics.targetW : metrics.collapsedDim));
}

/** Layout snap only. Visual FLIP transforms are cleared. */
export function applySearchExpandInstant(
  el: HTMLElement,
  iconEl: HTMLElement | null,
  open: boolean,
  metrics: SearchExpandMetrics,
): void {
  killMotion(el);
  if (iconEl) killMotion(iconEl);
  applySearchShellLayout(el, open, metrics);
  clearShellFlip(el);
  recordShellFlipBox(el, open, metrics);
  if (iconEl) {
    applyIconLayout(iconEl, open, metrics);
    clearIconFlip(iconEl);
  }
}

/**
 * FLIP the shell from the last recorded visual box (handles right-aligned toolbars).
 * Layout width snaps; visual interpolation is `x` + `scaleX` from the top-left.
 */
export function animateSearchShellExpand(
  el: HTMLElement,
  open: boolean,
  metrics: SearchExpandMetrics,
  config?: Readonly<MotionConfig>,
): gsap.core.Tween {
  const fallbackFromW = open ? metrics.collapsedDim : metrics.targetW;
  const first = shellFlipBox.get(el) ?? readBox(el, fallbackFromW);
  killMotion(el);
  applySearchShellLayout(el, open, metrics);
  const last = readBox(el, open ? metrics.targetW : metrics.collapsedDim);
  shellFlipBox.set(el, last);

  const dx = first.left - last.left;
  const sx = last.width > 0 ? first.width / last.width : 1;
  const fromRadius = open ? metrics.collapsedDim / 2 : metrics.expandedRadius;
  const toRadius = open ? metrics.expandedRadius : metrics.collapsedDim / 2;
  const vars = motionInteractiveFor(resolveMotionConfig(config));

  gsap.set(el, {
    x: dx,
    y: 0,
    scaleX: sx,
    scaleY: 1,
    borderRadius: fromRadius,
    transformOrigin: "0 0",
    force3D: false,
  });

  const to: MotionTransformVars = {
    x: 0,
    scaleX: 1,
    duration: vars.duration,
    ease: vars.ease,
  };

  return gsap.to(el, {
    ...to,
    borderRadius: toRadius,
    overwrite: "auto",
    force3D: false,
    onComplete: () => {
      clearShellFlip(el);
      recordShellFlipBox(el, open, metrics);
    },
  });
}

/**
 * FLIP the icon in parent space: layout `left` snaps, visual `x`.
 * `scaleX` counters the parent shell FLIP so the glyph is not stretched.
 */
export function animateSearchIconShift(
  iconEl: HTMLElement,
  shellEl: HTMLElement,
  open: boolean,
  metrics: SearchExpandMetrics,
  config?: Readonly<MotionConfig>,
): gsap.core.Tween {
  const parentSx = Number(gsap.getProperty(shellEl, "scaleX")) || 1;
  const borderPx = shellHorizontalBorderPx(shellEl);
  const fromLeft = open ? iconLeftCollapsedPx(metrics, borderPx) : metrics.padX;
  const toLeft = open ? metrics.padX : iconLeftCollapsedPx(metrics, borderPx);
  const x0 = fromLeft - toLeft;
  const counterSx = parentSx > 0 ? 1 / parentSx : 1;
  const vars = motionInteractiveFor(resolveMotionConfig(config));

  killMotion(iconEl);
  applyIconLayout(iconEl, open, metrics);
  gsap.set(iconEl, { x: x0, scaleX: counterSx, force3D: false });

  const to: MotionTransformVars = {
    x: 0,
    scaleX: 1,
    duration: vars.duration,
    ease: vars.ease,
  };

  return gsap.to(iconEl, {
    ...to,
    overwrite: "auto",
    force3D: false,
    onComplete: () => {
      applyIconLayout(iconEl, open, metrics);
      clearIconFlip(iconEl);
    },
  });
}
