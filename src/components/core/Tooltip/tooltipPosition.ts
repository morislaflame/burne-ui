export type TooltipSide = "top" | "right" | "bottom" | "left";

const VIEWPORT_PAD = 8;

export type TooltipPlacement = {
  left: number;
  top: number;
  resolvedSide: TooltipSide;
};

function centerClamp(value: number, size: number, max: number, pad: number) {
  return Math.max(pad, Math.min(value, max - size - pad));
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

function placeTop(tr: DOMRect, fr: DOMRect, gap: number, pad: number): TooltipPlacement {
  return {
    left: centerClamp(tr.left + tr.width / 2 - fr.width / 2, fr.width, window.innerWidth, pad),
    top: tr.top - gap - fr.height,
    resolvedSide: "top",
  };
}

function placeBottom(tr: DOMRect, fr: DOMRect, gap: number, pad: number): TooltipPlacement {
  return {
    left: centerClamp(tr.left + tr.width / 2 - fr.width / 2, fr.width, window.innerWidth, pad),
    top: tr.bottom + gap,
    resolvedSide: "bottom",
  };
}

function placeLeft(tr: DOMRect, fr: DOMRect, gap: number, pad: number): TooltipPlacement {
  return {
    left: tr.left - gap - fr.width,
    top: centerClamp(tr.top + tr.height / 2 - fr.height / 2, fr.height, window.innerHeight, pad),
    resolvedSide: "left",
  };
}

function placeRight(tr: DOMRect, fr: DOMRect, gap: number, pad: number): TooltipPlacement {
  return {
    left: tr.right + gap,
    top: centerClamp(tr.top + tr.height / 2 - fr.height / 2, fr.height, window.innerHeight, pad),
    resolvedSide: "right",
  };
}

const PLACERS: Record<
  TooltipSide,
  (tr: DOMRect, fr: DOMRect, gap: number, pad: number) => TooltipPlacement
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

/** Позиционирует тултип относительно триггера с flip при нехватке места. */
export function computeTooltipPlacement(
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  preferredSide: TooltipSide,
  offset: number,
): TooltipPlacement {
  const gap = offset;
  const pad = VIEWPORT_PAD;
  const order = FLIP_ORDER[preferredSide];

  for (const side of order) {
    if (!FIT_CHECKS[side](triggerRect, floatingRect.width, floatingRect.height, gap, pad)) {
      continue;
    }
    return PLACERS[side](triggerRect, floatingRect, gap, pad);
  }

  return PLACERS[preferredSide](triggerRect, floatingRect, gap, pad);
}

export const TOOLTIP_ARROW_CLASS: Record<TooltipSide, string> = {
  top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
  right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
};

/** Отступ оболочки под половину стрелки (size-2 → 4px) для позиционирования и overflow. */
export const TOOLTIP_ARROW_SHELL_PAD: Record<TooltipSide, string> = {
  top: "pb-1",
  bottom: "pt-1",
  left: "pr-1",
  right: "pl-1",
};
