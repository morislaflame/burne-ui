import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import {
  type CardSize,
  panelSizeLayout,
} from "@/components/core/utils/sizeLayout";
import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import type { ShadowLevel } from "@/tokens/shadows";
import { cn } from "@/utils/cn";

import type { CardVariant } from "./cardTypes";

export type { CardSize, PanelSizeLayout as CardSizeLayout } from "@/components/core/utils/sizeLayout";
export {
  CARD_SIZE_LAYOUT,
  PANEL_SIZE_LAYOUT,
  resolveCardSize,
  cardSizeLayout,
  panelSizeLayout,
} from "@/components/core/utils/sizeLayout";

const CARD_SURFACE: Record<Exclude<CardVariant, "gloss">, string> = {
  default: "bg-surface border-token",
  outline: "bg-transparent border-token-outline",
  secondary: "bg-secondary border-token",
};

/** Passive 2nd level — static shadow without hover-lift. */
export const CARD_STATIC_SHADOW_CLASS: Record<ShadowLevel, string> = {
  small: "shadow-token-small",
  base: "shadow-token-base",
  mid: "shadow-token-mid",
  large: "shadow-token-large",
};

export const CARD_GLOSS_PANEL_BASE_CLASS =
  "gloss-panel flex min-w-0 flex-col text-foreground outline-none";

export const CARD_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-w-0 flex-1 flex-col";

export const CARD_ROOT_BASE_CLASS =
  "flex min-w-0 flex-col overflow-hidden text-foreground outline-none";

export const CARD_PRESSABLE_ROOT_CLASS = "relative cursor-pointer focus-ring";

export const CARD_BUTTON_SHELL_CLASS = "w-full border-0 p-0 text-left";

export const CARD_PRESSABLE_CONTENT_CLASS =
  "relative flex min-w-0 flex-1 flex-col";

export const CARD_HEADER_BASE_CLASS = "flex shrink-0 flex-col text-left";

export const CARD_HEADING_BLOCK_BASE_CLASS =
  "flex min-w-0 flex-1 flex-col text-left";

export const CARD_BODY_BASE_CLASS = "min-w-0";

export const CARD_TITLE_CLASS = "min-w-0";

export const CARD_DESCRIPTION_CLASS = "min-w-0 text-muted";

export const CARD_FOOTER_BASE_CLASS = "mt-auto border-t-token text-muted";

export function cardGlossPanelClass(size: CardSize, className?: string): string {
  return cn(
    CARD_GLOSS_PANEL_BASE_CLASS,
    panelSizeLayout(size).rounded,
    SURFACE_COLOR_TRANSITION,
    className,
  );
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
  size: CardSize,
  shadow: ShadowLevel = "base",
  className?: string,
): string {
  return cn(
    CARD_ROOT_BASE_CLASS,
    panelSizeLayout(size).rounded,
    pressable && cn(CARD_PRESSABLE_ROOT_CLASS, pressableMotionClass),
    SURFACE_COLOR_TRANSITION,
    CARD_SURFACE[variant],
    !pressable && CARD_STATIC_SHADOW_CLASS[shadow],
    className,
  );
}

export function cardHeaderClass(size: CardSize, className?: string): string {
  const panel = panelSizeLayout(size);
  return cn(
    CARD_HEADER_BASE_CLASS,
    panel.headerPadding,
    // Title/Description often sit directly in Header — use headingGap, not
    // Dialog headerGap (that spaces heading block vs close).
    panel.headingGap,
    className,
  );
}

export function cardHeadingBlockClass(size: CardSize, className?: string): string {
  return cn(
    CARD_HEADING_BLOCK_BASE_CLASS,
    panelSizeLayout(size).headingGap,
    className,
  );
}

export function cardBodyClass(size: CardSize, className?: string): string {
  return cn(CARD_BODY_BASE_CLASS, panelSizeLayout(size).bodyPadding, className);
}

export function cardFooterClass(size: CardSize, className?: string): string {
  return cn(
    CARD_FOOTER_BASE_CLASS,
    panelSizeLayout(size).footerPadding,
    className,
  );
}
