import {
  type CardSize,
  panelSizeLayout,
} from "@/components/core/utils/sizeLayout";
import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import type { ShadowLevel } from "@/tokens/shadows";
import { cn } from "@/utils/cn";

import { resolveVariantVisual } from "@/skins/resolveVariantVisual";

import type { CardVariant, KitCardVariant } from "./cardTypes";
import { KIT_CARD_VARIANTS } from "./cardTypes";

export type { CardSize, PanelSizeLayout as CardSizeLayout } from "@/components/core/utils/sizeLayout";
export {
  CARD_SIZE_LAYOUT,
  PANEL_SIZE_LAYOUT,
  resolveCardSize,
  cardSizeLayout,
  panelSizeLayout,
} from "@/components/core/utils/sizeLayout";

const CARD_SURFACE: Record<KitCardVariant, string> = {
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

export const CARD_ROOT_BASE_CLASS =
  "flex min-w-0 flex-col text-foreground outline-none";

/** Clips a passive card. Pressable moves this onto the inner face so fade layers can paint. */
export const CARD_ROOT_CLIP_CLASS = "overflow-hidden";

export const CARD_PRESSABLE_ROOT_CLASS = "relative cursor-pointer focus-ring";

export const CARD_BUTTON_SHELL_CLASS = "w-full border-0 p-0 text-start";

export const CARD_PRESSABLE_CONTENT_CLASS =
  "relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[inherit]";

export const CARD_HEADER_BASE_CLASS = "flex shrink-0 flex-col text-start";

export const CARD_HEADING_BLOCK_BASE_CLASS =
  "flex min-w-0 flex-1 flex-col text-start";

export const CARD_BODY_BASE_CLASS = "min-w-0";

export const CARD_TITLE_CLASS = "min-w-0";

export const CARD_DESCRIPTION_CLASS = "min-w-0 text-muted";

export const CARD_FOOTER_BASE_CLASS = "mt-auto border-t-token text-muted";

export function cardRootClass(
  variant: CardVariant,
  pressable: boolean,
  pressableMotionClass: string,
  size: CardSize,
  shadow: ShadowLevel = "base",
  className?: string): string {
  const visual = resolveVariantVisual(variant, KIT_CARD_VARIANTS, "card.root");
  if (visual.className !== undefined) {
    return cn(
      CARD_ROOT_BASE_CLASS,
      panelSizeLayout(size).rounded,
      !pressable && CARD_ROOT_CLIP_CLASS,
      pressable && cn(CARD_PRESSABLE_ROOT_CLASS, pressableMotionClass),
      visual.className,
      className);
  }
  return cn(
    CARD_ROOT_BASE_CLASS,
    panelSizeLayout(size).rounded,
    !pressable && CARD_ROOT_CLIP_CLASS,
    pressable && cn(CARD_PRESSABLE_ROOT_CLASS, pressableMotionClass),
    SURFACE_COLOR_TRANSITION,
    CARD_SURFACE[visual.key],
    !pressable && CARD_STATIC_SHADOW_CLASS[shadow],
    className);
}

export function cardHeaderClass(size: CardSize, className?: string): string {
  const panel = panelSizeLayout(size);
  return cn(
    CARD_HEADER_BASE_CLASS,
    panel.headerPadding,
    // Title/Description often sit directly in Header — use headingGap, not
    // Dialog headerGap (that spaces heading block vs close).
    panel.headingGap,
    className);
}

export function cardHeadingBlockClass(size: CardSize, className?: string): string {
  return cn(
    CARD_HEADING_BLOCK_BASE_CLASS,
    panelSizeLayout(size).headingGap,
    className);
}

export function cardBodyClass(size: CardSize, className?: string): string {
  return cn(CARD_BODY_BASE_CLASS, panelSizeLayout(size).bodyPadding, className);
}

export function cardFooterClass(size: CardSize, className?: string): string {
  return cn(
    CARD_FOOTER_BASE_CLASS,
    panelSizeLayout(size).footerPadding,
    className);
}
