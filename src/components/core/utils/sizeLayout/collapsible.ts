import type { TextVariant } from "@/components/core/Text";

import type { ComponentSize } from "./componentSize";
import { resolveComponentSize } from "./componentSize";

export type CollapsibleSize = ComponentSize;

/**
 * Shared size grid for collapsible surfaces:
 * Disclosure, Expandable (Accordion via Expandable).
 *
 * Paddings mirror panel header/body rhythm, but live here — not `PANEL_SIZE_LAYOUT`.
 */
export type CollapsibleSizeLayout = {
  /** Trigger / header row (≈ panel `headerPadding`) */
  triggerPadding: string;
  /** Expanded body / panel (≈ panel `bodyPadding`) */
  contentPadding: string;
  titleVariant: TextVariant;
  /**
   * Title line-box — `leading-none` so glyphs sit tight vs chevron.
   * Overridable via Title / trigger title `className` (`leading-*`).
   */
  titleClassName: string;
  descVariant: TextVariant;
};

export const COLLAPSIBLE_SIZE_LAYOUT: Record<
  CollapsibleSize,
  CollapsibleSizeLayout
> = {
  small: {
    triggerPadding: "p-base",
    contentPadding: "p-base",
    titleVariant: "small",
    titleClassName: "leading-none",
    descVariant: "small",
  },
  base: {
    triggerPadding: "p-mid",
    contentPadding: "p-mid",
    titleVariant: "base",
    titleClassName: "leading-none",
    descVariant: "small",
  },
  mid: {
    triggerPadding: "p-mid",
    contentPadding: "p-mid",
    titleVariant: "mid",
    titleClassName: "leading-none",
    descVariant: "base",
  },
  large: {
    triggerPadding: "p-large",
    contentPadding: "p-large",
    titleVariant: "large",
    titleClassName: "leading-none",
    descVariant: "base",
  },
};

export function resolveCollapsibleSize(size?: CollapsibleSize): CollapsibleSize {
  return resolveComponentSize(size);
}

export function collapsibleSizeLayout(
  size?: CollapsibleSize,
): CollapsibleSizeLayout {
  return COLLAPSIBLE_SIZE_LAYOUT[resolveCollapsibleSize(size)];
}
