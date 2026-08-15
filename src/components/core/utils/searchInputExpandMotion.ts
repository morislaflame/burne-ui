import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";

export type SearchExpandMetrics = {
  targetW: number;
  collapsedDim: number;
  expandedRadius: number;
  padX: number;
  iconBox: number;
  iconLeftCollapsedCss: string;
};

function shellHorizontalBorderPx(shellEl: HTMLElement): number {
  return shellEl.offsetWidth - shellEl.clientWidth;
}

function iconLeftCollapsedAtBorderBoxWidth(
  borderBoxWidth: number,
  borderPx: number,
  iconBox: number,
): number {
  return (borderBoxWidth - borderPx - iconBox) / 2;
}

export function applySearchExpandInstant(
  el: HTMLElement,
  iconEl: HTMLElement | null,
  open: boolean,
  metrics: SearchExpandMetrics,
): void {
  killMotion(el);
  if (iconEl) killMotion(iconEl);
  if (open) {
    el.style.width = `${metrics.targetW}px`;
  } else {
    el.style.removeProperty("width");
  }
  el.style.removeProperty("height");
  el.style.removeProperty("borderRadius");
  if (iconEl) {
    iconEl.style.left = open ? `${metrics.padX}px` : metrics.iconLeftCollapsedCss;
    iconEl.style.removeProperty("transform");
  }
}

export function animateSearchShellExpand(
  el: HTMLElement,
  open: boolean,
  metrics: SearchExpandMetrics,
): gsap.core.Tween {
  killMotion(el);
  el.style.removeProperty("borderRadius");
  const vars = motionInteractive();

  if (open) {
    el.style.width = `${metrics.collapsedDim}px`;
    el.style.borderRadius = `${metrics.collapsedDim / 2}px`;
    return gsap.to(el, {
      width: metrics.targetW,
      borderRadius: metrics.expandedRadius,
      ...vars,
      overwrite: "auto",
      force3D: false,
      onComplete: () => {
        el.style.removeProperty("borderRadius");
      },
    });
  }

  return gsap.to(el, {
    width: metrics.collapsedDim,
    borderRadius: metrics.collapsedDim / 2,
    ...vars,
    overwrite: "auto",
    force3D: false,
    onComplete: () => {
      el.style.removeProperty("width");
      el.style.removeProperty("borderRadius");
    },
  });
}

export function animateSearchIconShift(
  iconEl: HTMLElement,
  shellEl: HTMLElement,
  open: boolean,
  metrics: SearchExpandMetrics,
): gsap.core.Tween {
  killMotion(iconEl);
  const vars = motionInteractive();

  if (open) {
    const iconLeftFrom = (shellEl.clientWidth - metrics.iconBox) / 2;
    iconEl.style.left = `${iconLeftFrom}px`;
    return gsap.to(iconEl, {
      left: metrics.padX,
      ...vars,
      overwrite: "auto",
      force3D: false,
    });
  }

  const borderPx = shellHorizontalBorderPx(shellEl);
  const iconLeftTo = iconLeftCollapsedAtBorderBoxWidth(
    metrics.collapsedDim,
    borderPx,
    metrics.iconBox,
  );
  iconEl.style.left = `${metrics.padX}px`;
  return gsap.to(iconEl, {
    left: iconLeftTo,
    ...vars,
    overwrite: "auto",
    force3D: false,
    onComplete: () => {
      iconEl.style.left = metrics.iconLeftCollapsedCss;
    },
  });
}
