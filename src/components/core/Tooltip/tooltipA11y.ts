import type { FocusEvent, PointerEvent } from "react";

export function mergeDescribedBy(
  existing: string | undefined,
  tooltipId: string,
  open: boolean,
) {
  if (!open) return existing;
  if (!existing) return tooltipId;
  if (existing.split(/\s+/).includes(tooltipId)) return existing;
  return `${existing} ${tooltipId}`;
}

export function bindTriggerEvents<T extends HTMLElement>(
  handlers: {
    onPointerEnter?: (e: PointerEvent<T>) => void;
    onPointerLeave?: (e: PointerEvent<T>) => void;
    onFocus?: (e: FocusEvent<T>) => void;
    onBlur?: (e: FocusEvent<T>) => void;
  },
  user?: {
    onPointerEnter?: (e: PointerEvent<T>) => void;
    onPointerLeave?: (e: PointerEvent<T>) => void;
    onFocus?: (e: FocusEvent<T>) => void;
    onBlur?: (e: FocusEvent<T>) => void;
  },
) {
  return {
    onPointerEnter: (e: PointerEvent<T>) => {
      handlers.onPointerEnter?.(e);
      user?.onPointerEnter?.(e);
    },
    onPointerLeave: (e: PointerEvent<T>) => {
      handlers.onPointerLeave?.(e);
      user?.onPointerLeave?.(e);
    },
    onFocus: (e: FocusEvent<T>) => {
      handlers.onFocus?.(e);
      user?.onFocus?.(e);
    },
    onBlur: (e: FocusEvent<T>) => {
      handlers.onBlur?.(e);
      user?.onBlur?.(e);
    },
  };
}
