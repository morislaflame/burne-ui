import { FIELD_SHELL_FOCUS_CLASS, FIELD_SHELL_TRANSITION_CLASS, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";

import { resolveFieldShellSurfaceClass } from "@/components/core/utils/fieldShellVariant";

import type { TextAreaSize, TextAreaStatus, TextAreaVariant } from "./textAreaTypes";

import { cn } from "@/utils/cn";

export const TEXTAREA_STATUS_TINT_SHELL_CLASS: Record<
  Exclude<TextAreaStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  info: "bg-surface-tint-info",
  warning: "bg-surface-tint-warning",
};

export const TEXTAREA_MIN_H: Record<TextAreaSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};

export const TEXTAREA_SHELL_LAYOUT_CLASS = "flex flex-col items-stretch";

export const TEXTAREA_CONTROL_BASE_CLASS =
  `box-border block min-h-0 w-full flex-1 resize-none overflow-auto bg-transparent font-inherit text-foreground outline-none placeholder:text-muted appearance-none [field-sizing:content] ${FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS}`;

/** Resize grip strokes — micro-geometry for the affordance (not spacing scale). */
export const TEXTAREA_RESIZE_GRIP_LINE_PRIMARY_CLASS =
  "absolute bottom-[length:calc(var(--border-width)*2)] right-0 block h-[length:var(--border-width)] w-[length:calc(var(--border-width)*9)] origin-bottom-right rotate-[135deg] bg-muted";

export const TEXTAREA_RESIZE_GRIP_LINE_SECONDARY_CLASS =
  "absolute bottom-[length:calc(var(--border-width)*6)] right-0 block h-[length:var(--border-width)] w-[length:calc(var(--border-width)*6)] origin-bottom-right rotate-[135deg] bg-muted";

export const TEXTAREA_RESIZE_GRIP_WRAP_CLASS =
  "relative block size-[length:var(--size-scale-small)] shrink-0";

export const TEXTAREA_RESIZE_HANDLE_BASE_CLASS =
  "absolute bottom-0 right-0 z-[2] m-0 flex touch-none select-none appearance-none border-0 bg-transparent items-end justify-end p-xsmall outline-none focus-ring-inset";

export const TEXTAREA_RESIZE_HANDLE_DISABLED_CLASS = "cursor-not-allowed opacity-45";

export const TEXTAREA_RESIZE_HANDLE_ENABLED_CLASS = "cursor-ns-resize";

export function textareaControlClass(size: TextAreaSize): string {
  return CONTROL_SIZE_LAYOUT[size].controlPad;
}

export function textareaShellSurfaceClass({
  variant,
  status,
  statusTinted,
}: {
  variant: TextAreaVariant;
  status: TextAreaStatus;
  statusTinted: boolean;
}): string {
  return resolveFieldShellSurfaceClass({
    variant,
    statusTinted: statusTinted && status !== "default",
    statusTintClass: status !== "default" ? TEXTAREA_STATUS_TINT_SHELL_CLASS[status] : "",
  });
}

export function textareaShellClass({
  variant,
  status,
  blocked,
  size,
  shellSurface,
  glossShellHoverMotionClass,
  standardShellHoverMotionClass,
  slotClass,
  className,
}: {
  variant: TextAreaVariant;
  status: TextAreaStatus;
  blocked: boolean;
  size: TextAreaSize;
  shellSurface: string;
  glossShellHoverMotionClass?: string;
  standardShellHoverMotionClass?: string;
  slotClass?: string;
  className?: string;
}) {
  const isGloss = variant === "gloss";

  return cn(
    "relative w-full overflow-hidden rounded-base border-1",
    TEXTAREA_SHELL_LAYOUT_CLASS,
    isGloss && "relative",
    TEXTAREA_MIN_H[size],
    shellSurface,
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_SHELL_FOCUS_CLASS,
    isGloss ? glossShellHoverMotionClass : fieldShellHoverClass(!blocked, status, variant),
    !isGloss && standardShellHoverMotionClass,
    blocked ? "cursor-not-allowed opacity-55 shadow-token-base" : "",
    slotClass,
    className,
  );
}

export function textareaControlClassNames({
  size,
  resizable,
  slotClass,
}: {
  size: TextAreaSize;
  resizable: boolean;
  slotClass?: string;
}) {
  return cn(
    TEXTAREA_CONTROL_BASE_CLASS,
    resizable && "pr-large",
    textareaControlClass(size),
    slotClass,
    FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
  );
}

export function textareaResizeHandleClass({
  disabled,
  slotClass,
}: {
  disabled?: boolean;
  slotClass?: string;
}) {
  return cn(
    TEXTAREA_RESIZE_HANDLE_BASE_CLASS,
    disabled ? TEXTAREA_RESIZE_HANDLE_DISABLED_CLASS : TEXTAREA_RESIZE_HANDLE_ENABLED_CLASS,
    slotClass,
  );
}
