import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractiveFor, resolveMotionConfig, type MotionConfig } from "@/components/core/utils/motionConfig";

export type SearchExpandMetrics = {
  targetW: number;
  collapsedDim: number;
  expandedRadius: number;
  padX: number;
  iconBox: number;
  iconLeftCollapsedCss: string;
};

/** Last committed layout width — React may drop `w-control-*` before the recipe runs. */
const lastShellWidth = new WeakMap<HTMLElement, number>();

function shellHorizontalBorderPx(shellEl: HTMLElement): number {
  return shellEl.offsetWidth - shellEl.clientWidth;
}

export function iconLeftCollapsedPx(
  metrics: SearchExpandMetrics,
  borderPx: number,
): number {
  return (metrics.collapsedDim - borderPx - metrics.iconBox) / 2;
}

function recordShellWidth(el: HTMLElement, open: boolean, metrics: SearchExpandMetrics): void {
  const w = el.getBoundingClientRect().width;
  lastShellWidth.set(el, w > 0 ? w : open ? metrics.targetW : metrics.collapsedDim);
}

/**
 * Prefer live inline width (mid-tween interrupt). If React already swapped
 * collapsed `w-control-*` for auto, fall back to the last committed box.
 */
function readFromWidth(el: HTMLElement, open: boolean, metrics: SearchExpandMetrics): number {
  const fallback = open ? metrics.collapsedDim : metrics.targetW;
  const rectW = el.getBoundingClientRect().width;
  if (el.style.width) {
    const inline = Number.parseFloat(el.style.width);
    if (Number.isFinite(inline) && inline > 0) return rectW > 0 ? rectW : inline;
  }
  const recorded = lastShellWidth.get(el);
  if (recorded && recorded > 0) return recorded;
  return rectW > 0 ? rectW : fallback;
}

/** Map current width onto the collapsed circle → expanded radius range. */
export function searchShellRadiusForWidth(width: number, metrics: SearchExpandMetrics): number {
  const span = metrics.targetW - metrics.collapsedDim;
  const t = span > 0 ? (width - metrics.collapsedDim) / span : 0;
  const clamped = Math.min(1, Math.max(0, t));
  const collapsedR = metrics.collapsedDim / 2;
  return collapsedR + clamped * (metrics.expandedRadius - collapsedR);
}

function applySearchShellLayout(el: HTMLElement, open: boolean, metrics: SearchExpandMetrics): void {
  if (open) {
    el.style.width = `${metrics.targetW}px`;
  } else {
    el.style.removeProperty("width");
  }
  el.style.removeProperty("height");
}

function clearShellMotion(el: HTMLElement): void {
  gsap.set(el, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    clearProps: "transform,transformOrigin,borderRadius",
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

/** Layout snap only. Visual transforms are cleared. */
export function applySearchExpandInstant(
  el: HTMLElement,
  iconEl: HTMLElement | null,
  open: boolean,
  metrics: SearchExpandMetrics,
): void {
  killMotion(el);
  if (iconEl) killMotion(iconEl);
  applySearchShellLayout(el, open, metrics);
  clearShellMotion(el);
  recordShellWidth(el, open, metrics);
  if (iconEl) {
    applyIconLayout(iconEl, open, metrics);
    clearIconFlip(iconEl);
  }
}

/**
 * Layout exception: tween shell `width` + `borderRadius` (not `scaleX`).
 * `scaleX` on `rounded-full` turns the pill into an ellipse and stretches the icon.
 * Right-aligned toolbars grow through layout (`flex-end` / `ml-auto`) — no FLIP `x`.
 */
export function animateSearchShellExpand(
  el: HTMLElement,
  open: boolean,
  metrics: SearchExpandMetrics,
  config?: Readonly<MotionConfig>,
): gsap.core.Tween {
  const fromW = readFromWidth(el, open, metrics);
  const toW = open ? metrics.targetW : metrics.collapsedDim;
  const fromRadius = searchShellRadiusForWidth(fromW, metrics);
  const toRadius = open ? metrics.expandedRadius : metrics.collapsedDim / 2;
  const vars = motionInteractiveFor(resolveMotionConfig(config));

  killMotion(el);
  gsap.set(el, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    force3D: false,
  });

  return gsap.fromTo(
    el,
    { width: fromW, borderRadius: fromRadius },
    {
      width: toW,
      borderRadius: toRadius,
      duration: vars.duration,
      ease: vars.ease,
      overwrite: "auto",
      force3D: false,
      onComplete: () => {
        applySearchShellLayout(el, open, metrics);
        clearShellMotion(el);
        recordShellWidth(el, open, metrics);
      },
    },
  );
}

/**
 * Layout `left` snaps; visual interpolation is `x` only (no `scaleX` —
 * the shell no longer scales, so a counter-scale would stretch the glyph).
 */
export function animateSearchIconShift(
  iconEl: HTMLElement,
  shellEl: HTMLElement,
  open: boolean,
  metrics: SearchExpandMetrics,
  config?: Readonly<MotionConfig>,
): gsap.core.Tween {
  const borderPx = shellHorizontalBorderPx(shellEl);
  const fromLeft = open ? iconLeftCollapsedPx(metrics, borderPx) : metrics.padX;
  const toLeft = open ? metrics.padX : iconLeftCollapsedPx(metrics, borderPx);
  const x0 = fromLeft - toLeft;
  const vars = motionInteractiveFor(resolveMotionConfig(config));

  killMotion(iconEl);
  applyIconLayout(iconEl, open, metrics);
  gsap.set(iconEl, { x: x0, scaleX: 1, force3D: false });

  return gsap.to(iconEl, {
    x: 0,
    duration: vars.duration,
    ease: vars.ease,
    overwrite: "auto",
    force3D: false,
    onComplete: () => {
      applyIconLayout(iconEl, open, metrics);
      clearIconFlip(iconEl);
    },
  });
}
