import {
  FIELD_SHELL_FOCUS_CLASS,
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellHoverClass,
} from "@/components/core/utils/useFieldShellHoverLift";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";

import { mergeTextAreaSlotClass } from "./textAreaAPI";
import type { TextAreaSize, TextAreaStatus, TextAreaVariant } from "./textAreaTypes";

export const TEXTAREA_VARIANT_SHELL_CLASS: Record<Exclude<TextAreaVariant, "gloss">, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
};

export const TEXTAREA_STATUS_TINT_SHELL_CLASS: Record<
  Exclude<TextAreaStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
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
  "box-border block min-h-0 w-full flex-1 resize-none overflow-auto bg-transparent font-inherit text-foreground outline-none placeholder:text-muted appearance-none [field-sizing:content]";

export const TEXTAREA_RESIZE_GRIP_LINE_PRIMARY_CLASS =
  "absolute bottom-[2px] right-0 block h-px w-[9px] origin-bottom-right rotate-[135deg] bg-muted";

export const TEXTAREA_RESIZE_GRIP_LINE_SECONDARY_CLASS =
  "absolute bottom-[6px] right-0 block h-px w-[6px] origin-bottom-right rotate-[135deg] bg-muted";

export const TEXTAREA_RESIZE_GRIP_WRAP_CLASS = "relative block size-3 shrink-0";

export const TEXTAREA_RESIZE_HANDLE_BASE_CLASS =
  "absolute bottom-0 right-0 z-[2] m-0 flex touch-none select-none appearance-none border-0 bg-transparent items-end justify-end p-xsmall";

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
  if (variant === "gloss") return "gloss-control";

  if (statusTinted && status !== "default") {
    return mergeTextAreaSlotClass(
      TEXTAREA_STATUS_TINT_SHELL_CLASS[status],
      "border-token",
    );
  }

  return mergeTextAreaSlotClass(
    variant === "outline"
      ? "bg-transparent border-token"
      : mergeTextAreaSlotClass(TEXTAREA_VARIANT_SHELL_CLASS[variant], "border-token"),
  );
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

  return mergeTextAreaSlotClass(
    "relative w-full overflow-hidden rounded-base border-1",
    TEXTAREA_SHELL_LAYOUT_CLASS,
    isGloss && "relative",
    TEXTAREA_MIN_H[size],
    shellSurface,
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_SHELL_FOCUS_CLASS,
    isGloss ? glossShellHoverMotionClass : fieldShellHoverClass(!blocked, status),
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
  return mergeTextAreaSlotClass(
    TEXTAREA_CONTROL_BASE_CLASS,
    resizable && "pr-mid",
    textareaControlClass(size),
    slotClass,
  );
}

export function textareaResizeHandleClass({
  disabled,
  slotClass,
}: {
  disabled?: boolean;
  slotClass?: string;
}) {
  return mergeTextAreaSlotClass(
    TEXTAREA_RESIZE_HANDLE_BASE_CLASS,
    disabled ? TEXTAREA_RESIZE_HANDLE_DISABLED_CLASS : TEXTAREA_RESIZE_HANDLE_ENABLED_CLASS,
    slotClass,
  );
}
