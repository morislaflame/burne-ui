export type TooltipSide = "top" | "right" | "bottom" | "left";
 
export type FloatingAlign = "start" | "center" | "end";
 
const VIEWPORT_PAD = 8;
 
export type TooltipPlacement = {
  left: number;
  top: number;
  resolvedSide: TooltipSide;
};
 
export type TooltipPlacementOptions = {
  align?: FloatingAlign;
  collisionPadding?: number;
  avoidCollisions?: boolean;
};
 
type ViewportBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function getViewportBounds(): ViewportBounds {
  if (typeof window === "undefined") {
    return { left: 0, top: 0, right: 1024, bottom: 768 };
  }
  const vv = window.visualViewport;
  if (vv) {
    const left = vv.offsetLeft ?? 0;
    const top = vv.offsetTop ?? 0;
    return {
      left,
      top,
      right: left + vv.width,
      bottom: top + vv.height,
    };
  }
  return {
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
}

function clampToViewport(
  value: number,
  size: number,
  vpStart: number,
  vpEnd: number,
  pad: number,
) {
  const min = vpStart + pad;
  const max = Math.max(min, vpEnd - size - pad);
  return Math.max(min, Math.min(value, max));
}

function alignAlongAxis(
  anchorStart: number,
  anchorSize: number,
  floatingSize: number,
  align: FloatingAlign,
  vpStart: number,
  vpEnd: number,
  pad: number,
) {
  const pos =
    align === "start"
      ? anchorStart
      : align === "end"
        ? anchorStart + anchorSize - floatingSize
        : anchorStart + anchorSize / 2 - floatingSize / 2;
  return clampToViewport(pos, floatingSize, vpStart, vpEnd, pad);
}

function fitsTop(tr: DOMRect, height: number, gap: number, pad: number, vp: ViewportBounds) {
  return tr.top - gap - height >= vp.top + pad;
}

function fitsBottom(tr: DOMRect, height: number, gap: number, pad: number, vp: ViewportBounds) {
  return tr.bottom + gap + height <= vp.bottom - pad;
}

function fitsLeft(tr: DOMRect, width: number, gap: number, pad: number, vp: ViewportBounds) {
  return tr.left - gap - width >= vp.left + pad;
}

function fitsRight(tr: DOMRect, width: number, gap: number, pad: number, vp: ViewportBounds) {
  return tr.right + gap + width <= vp.right - pad;
}

function placeTop(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
  vp: ViewportBounds,
): TooltipPlacement {
  return {
    left: alignAlongAxis(tr.left, tr.width, fr.width, align, vp.left, vp.right, pad),
    top: clampToViewport(tr.top - gap - fr.height, fr.height, vp.top, vp.bottom, pad),
    resolvedSide: "top",
  };
}

function placeBottom(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
  vp: ViewportBounds,
): TooltipPlacement {
  return {
    left: alignAlongAxis(tr.left, tr.width, fr.width, align, vp.left, vp.right, pad),
    top: clampToViewport(tr.bottom + gap, fr.height, vp.top, vp.bottom, pad),
    resolvedSide: "bottom",
  };
}

function placeLeft(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
  vp: ViewportBounds,
): TooltipPlacement {
  return {
    left: clampToViewport(tr.left - gap - fr.width, fr.width, vp.left, vp.right, pad),
    top: alignAlongAxis(tr.top, tr.height, fr.height, align, vp.top, vp.bottom, pad),
    resolvedSide: "left",
  };
}

function placeRight(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
  vp: ViewportBounds,
): TooltipPlacement {
  return {
    left: clampToViewport(tr.right + gap, fr.width, vp.left, vp.right, pad),
    top: alignAlongAxis(tr.top, tr.height, fr.height, align, vp.top, vp.bottom, pad),
    resolvedSide: "right",
  };
}

const PLACERS: Record<
  TooltipSide,
  (
    tr: DOMRect,
    fr: DOMRect,
    gap: number,
    pad: number,
    align: FloatingAlign,
    vp: ViewportBounds,
  ) => TooltipPlacement
> = {
  top: placeTop,
  bottom: placeBottom,
  left: placeLeft,
  right: placeRight,
};

const FIT_CHECKS: Record<
  TooltipSide,
  (tr: DOMRect, w: number, h: number, gap: number, pad: number, vp: ViewportBounds) => boolean
> = {
  top: (tr, _w, h, gap, pad, vp) => fitsTop(tr, h, gap, pad, vp),
  bottom: (tr, _w, h, gap, pad, vp) => fitsBottom(tr, h, gap, pad, vp),
  left: (tr, w, _h, gap, pad, vp) => fitsLeft(tr, w, gap, pad, vp),
  right: (tr, w, _h, gap, pad, vp) => fitsRight(tr, w, gap, pad, vp),
};

const FLIP_ORDER: Record<TooltipSide, TooltipSide[]> = {
  top: ["top", "bottom", "right", "left"],
  bottom: ["bottom", "top", "right", "left"],
  left: ["left", "right", "top", "bottom"],
  right: ["right", "left", "top", "bottom"],
};

export function computeTooltipPlacement(
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  preferredSide: TooltipSide,
  offset: number,
  options?: TooltipPlacementOptions,
): TooltipPlacement {
  const gap = offset;
  const pad = options?.collisionPadding ?? VIEWPORT_PAD;
  const align = options?.align ?? "center";
  const avoid = options?.avoidCollisions !== false;
  const vp = getViewportBounds();
  const order = avoid ? FLIP_ORDER[preferredSide] : [preferredSide];

  for (const side of order) {
    if (!FIT_CHECKS[side](triggerRect, floatingRect.width, floatingRect.height, gap, pad, vp)) {
      continue;
    }
    return PLACERS[side](triggerRect, floatingRect, gap, pad, align, vp);
  }

  return PLACERS[preferredSide](triggerRect, floatingRect, gap, pad, align, vp);
}
 
export const TOOLTIP_ARROW_CLASS: Record<TooltipSide, string> = {
  top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
  right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
};
 
export const TOOLTIP_ARROW_SHELL_PAD: Record<TooltipSide, string> = {
  top: "pb-1",
  bottom: "pt-1",
  left: "pr-1",
  right: "pl-1",
};
 