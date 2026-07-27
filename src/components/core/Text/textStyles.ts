import type { ElementType } from "react";

import { cn } from "@/utils/cn";

import type { TextVariant } from "./textTypes";

/**
 * Size + weight only. Line-height is a separate `leading-*` class so callers
 * (and panel titles) can override via `cn` / twMerge without `!important`.
 */
export const TEXT_VARIANT_FACE_CLASS: Record<TextVariant, string> = {
  "accent-header":
    "[font-size:var(--text-accent-header-size)] [font-weight:var(--text-accent-header-weight)]",
  "header-1":
    "[font-size:var(--text-header-1-size)] [font-weight:var(--text-header-1-weight)]",
  "header-2":
    "[font-size:var(--text-header-2-size)] [font-weight:var(--text-header-2-weight)]",
  large: "[font-size:var(--text-large-size)] [font-weight:var(--text-large-weight)]",
  mid: "[font-size:var(--text-mid-size)] [font-weight:var(--text-mid-weight)]",
  base: "[font-size:var(--text-base-size)] [font-weight:var(--text-base-weight)]",
  small: "[font-size:var(--text-small-size)] [font-weight:var(--text-small-weight)]",
  xsmall: "[font-size:var(--text-xsmall-size)] [font-weight:var(--text-xsmall-weight)]",
};

/** Default role line-height — swapped out when `className` has another `leading-*`. */
export const TEXT_VARIANT_LEADING_CLASS: Record<TextVariant, string> = {
  "accent-header": "leading-[var(--text-accent-header-line-height)]",
  "header-1": "leading-[var(--text-header-1-line-height)]",
  "header-2": "leading-[var(--text-header-2-line-height)]",
  large: "leading-[var(--text-large-line-height)]",
  mid: "leading-[var(--text-mid-line-height)]",
  base: "leading-[var(--text-base-line-height)]",
  small: "leading-[var(--text-small-line-height)]",
  xsmall: "leading-[var(--text-xsmall-line-height)]",
};

export const TEXT_VARIANT_DEFAULT_AS: Record<TextVariant, ElementType> = {
  "accent-header": "h1",
  "header-1": "h2",
  "header-2": "h3",
  large: "p",
  mid: "p",
  base: "p",
  small: "p",
  xsmall: "p",
};

export const TEXT_FOREGROUND_CLASS = "text-foreground";

export function textRootClass(
  variant: TextVariant,
  inheritColor: boolean | undefined,
  className?: string,
): string {
  return cn(
    TEXT_VARIANT_FACE_CLASS[variant],
    TEXT_VARIANT_LEADING_CLASS[variant],
    !inheritColor && TEXT_FOREGROUND_CLASS,
    className,
  );
}
