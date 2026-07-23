import type { ElementType } from "react";

import { cn } from "@/utils/cn";

import type { TextVariant } from "./textTypes";

export const TEXT_VARIANT_CLASS: Record<TextVariant, string> = {
  "accent-header": "text-accent-header",
  "header-1": "text-header-1",
  "header-2": "text-header-2",
  large: "text-large",
  mid: "text-mid",
  base: "text-base",
  small: "text-small",
  xsmall: "text-xsmall",
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
    TEXT_VARIANT_CLASS[variant],
    !inheritColor && TEXT_FOREGROUND_CLASS,
    className,
  );
}
