import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import type { CardVariant } from "./cardTypes";

const CARD_SURFACE: Record<Exclude<CardVariant, "gloss">, string> = {
  default: "bg-surface border-token",
  outline: "bg-transparent border-token",
  secondary: "bg-secondary border-token",
};

/** Passive 2nd level — static sm-shadow without hover-lift. */
export const CARD_STATIC_SHADOW_CLASS = "shadow-token-base";

export const CARD_GLOSS_PANEL_CLASS =
  "gloss-panel flex min-w-0 flex-col rounded-mid text-foreground outline-none";

export const CARD_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-w-0 flex-1 flex-col";

export const CARD_ROOT_BASE_CLASS =
  "flex min-w-0 flex-col overflow-hidden rounded-mid text-foreground outline-none";

export const CARD_PRESSABLE_ROOT_CLASS = "relative cursor-pointer focus-ring";

export const CARD_BUTTON_SHELL_CLASS = "w-full border-0 p-0 text-left";

export const CARD_PRESSABLE_CONTENT_CLASS =
  "relative flex min-w-0 flex-1 flex-col";

export const CARD_HEADER_CLASS =
  "flex shrink-0 flex-col gap-small py-plus px-mid text-left";

export const CARD_HEADING_BLOCK_CLASS =
  "flex min-w-0 flex-1 flex-col gap-xsmall text-left";

export const CARD_BODY_CLASS = "min-w-0 px-mid pb-mid";

export const CARD_TITLE_CLASS = "min-w-0";

export const CARD_DESCRIPTION_CLASS = "min-w-0 text-muted";

export const CARD_FOOTER_CLASS =
  "mt-auto border-t-token py-plus px-mid text-muted";

export function cardGlossPanelClass(className?: string): string {
  return cn(CARD_GLOSS_PANEL_CLASS, SURFACE_COLOR_TRANSITION, className);
}

export function cardGlossPressableClass(pressable: boolean): string {
  return pressable
    ? cn(GLOSS_INTERACTIVE_MOTION_CLASS, "cursor-pointer focus-ring")
    : "";
}

export function cardRootClass(
  variant: Exclude<CardVariant, "gloss">,
  pressable: boolean,
  pressableMotionClass: string,
  className?: string,
): string {
  return cn(
    CARD_ROOT_BASE_CLASS,
    pressable && cn(CARD_PRESSABLE_ROOT_CLASS, pressableMotionClass),
    SURFACE_COLOR_TRANSITION,
    CARD_SURFACE[variant],
    !pressable && CARD_STATIC_SHADOW_CLASS,
    className,
  );
}
