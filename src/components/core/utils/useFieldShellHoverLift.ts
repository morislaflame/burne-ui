import { useCallback, useLayoutEffect, useMemo } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

import {
  animateInteractiveHoverLift,
  initElementShadow,
  shadowMd,
  shadowSm,
  shouldSkipInteractiveHoverLift,
} from "./hoverInteractiveLift";
import { hoverVariantBg, type HoverVariant } from "./hoverVariant";

export type FieldShellStatus = "default" | "danger" | "success" | "warning";

/** Статусный tint-фон поля → усиленный tint на hover (не *-fill как у залитых кнопок). */
const FIELD_SHELL_HOVER_VARIANT: Record<FieldShellStatus, HoverVariant> = {
  default: "default",
  danger: "danger-tint-hover",
  success: "success-tint-hover",
  warning: "warning-tint-hover",
};

/** Классы оболочки поля: тень через `--el-shadow`, lift как у `Alert`. */
export const FIELD_SHELL_HOVER_MOTION_CLASS =
  "animate-shadow will-change-transform origin-center";

/** Transition оболочки: фон, тень, focus-ring (всегда, в т.ч. disabled). */
export const FIELD_SHELL_TRANSITION_CLASS =
  "field-shell-transition motion-reduce:transition-none";

/** Внешнее focus-кольцо primary при `:focus-within` на оболочке. */
export const FIELD_SHELL_FOCUS_CLASS = "focus-within-ring";

/** Hover-фон оболочки поля через `hoverVariant`; `focus-within` — фокус на внутреннем control. */
export function fieldShellHoverClass(
  enabled: boolean,
  status: FieldShellStatus = "default",
): string {
  if (!enabled) return "";
  return hoverVariantBg(FIELD_SHELL_HOVER_VARIANT[status], "focus-within");
}

/**
 * Hover-подъём и sm → md тень для оболочки input-like полей (`Input`, `TextArea`, `TimeField`, `ComboBox`).
 */
export function useFieldShellHoverLift(
  shellRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const shellShadow = useMemo(
    () => ({ idle: shadowSm(), hover: shadowMd() }),
    [],
  );

  useLayoutEffect(() => {
    if (!enabled) return;
    initElementShadow(shellRef.current, shadowSm());
  });

  const onShellPointerEnter = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || e.defaultPrevented) return;
      const el = shellRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, undefined, shellShadow);
    },
    [enabled, shellRef, shellShadow],
  );

  const onShellPointerLeave = useCallback(
    (_e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const el = shellRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false, undefined, shellShadow);
    },
    [enabled, shellRef, shellShadow],
  );

  return {
    shellHoverMotionClass: enabled ? FIELD_SHELL_HOVER_MOTION_CLASS : "",
    onShellPointerEnter,
    onShellPointerLeave,
  };
}
