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
};

function centerClamp(value: number, size: number, max: number, pad: number) {
  return Math.max(pad, Math.min(value, max - size - pad));
}

function alignAlongAxis(
  anchorStart: number,
  anchorSize: number,
  floatingSize: number,
  align: FloatingAlign,
  viewportMax: number,
  pad: number,
) {
  const left =
    align === "start"
      ? anchorStart
      : align === "end"
        ? anchorStart + anchorSize - floatingSize
        : anchorStart + anchorSize / 2 - floatingSize / 2;
  return centerClamp(left, floatingSize, viewportMax, pad);
}

function fitsTop(tr: DOMRect, height: number, gap: number, pad: number) {
  return tr.top - gap - height >= pad;
}

function fitsBottom(tr: DOMRect, height: number, gap: number, pad: number) {
  return tr.bottom + gap + height <= window.innerHeight - pad;
}

function fitsLeft(tr: DOMRect, width: number, gap: number, pad: number) {
  return tr.left - gap - width >= pad;
}

function fitsRight(tr: DOMRect, width: number, gap: number, pad: number) {
  return tr.right + gap + width <= window.innerWidth - pad;
}

function placeTop(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
): TooltipPlacement {
  return {
    left: alignAlongAxis(tr.left, tr.width, fr.width, align, window.innerWidth, pad),
    top: tr.top - gap - fr.height,
    resolvedSide: "top",
  };
}

function placeBottom(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
): TooltipPlacement {
  return {
    left: alignAlongAxis(tr.left, tr.width, fr.width, align, window.innerWidth, pad),
    top: tr.bottom + gap,
    resolvedSide: "bottom",
  };
}

function placeLeft(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
): TooltipPlacement {
  return {
    left: tr.left - gap - fr.width,
    top: alignAlongAxis(tr.top, tr.height, fr.height, align, window.innerHeight, pad),
    resolvedSide: "left",
  };
}

function placeRight(
  tr: DOMRect,
  fr: DOMRect,
  gap: number,
  pad: number,
  align: FloatingAlign,
): TooltipPlacement {
  return {
    left: tr.right + gap,
    top: alignAlongAxis(tr.top, tr.height, fr.height, align, window.innerHeight, pad),
    resolvedSide: "right",
  };
}

const PLACERS: Record<
  TooltipSide,
  (tr: DOMRect, fr: DOMRect, gap: number, pad: number, align: FloatingAlign) => TooltipPlacement
> = {
  top: placeTop,
  bottom: placeBottom,
  left: placeLeft,
  right: placeRight,
};

const FIT_CHECKS: Record<
  TooltipSide,
  (tr: DOMRect, w: number, h: number, gap: number, pad: number) => boolean
> = {
  top: (tr, _w, h, gap, pad) => fitsTop(tr, h, gap, pad),
  bottom: (tr, _w, h, gap, pad) => fitsBottom(tr, h, gap, pad),
  left: (tr, w, _h, gap, pad) => fitsLeft(tr, w, gap, pad),
  right: (tr, w, _h, gap, pad) => fitsRight(tr, w, gap, pad),
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
  const pad = VIEWPORT_PAD;
  const align = options?.align ?? "center";
  const order = FLIP_ORDER[preferredSide];

  for (const side of order) {
    if (!FIT_CHECKS[side](triggerRect, floatingRect.width, floatingRect.height, gap, pad)) {
      continue;
    }
    return PLACERS[side](triggerRect, floatingRect, gap, pad, align);
  }

  return PLACERS[preferredSide](triggerRect, floatingRect, gap, pad, align);
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
