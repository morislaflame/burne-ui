import { createElement, forwardRef, type ElementType, type HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

/** Роли типографики из `@utility` / темы (см. Foundations/Typography). */
export type TextVariant =
  | "accent-header"
  | "header-1"
  | "header-2"
  | "large"
  | "mid"
  | "base"
  | "small"
  | "tools";

const VARIANT_CLASS: Record<TextVariant, string> = {
  "accent-header": "text-accent-header",
  "header-1": "text-header-1",
  "header-2": "text-header-2",
  large: "text-large",
  mid: "text-mid",
  base: "text-base",
  small: "text-small",
  tools: "text-tools",
};

/**
 * Семантика по умолчанию: заголовки — уровни 1–3, остальное — абзац.
 * Задайте `as`, если нужен `span` внутри строки или другой тег.
 */
const VARIANT_DEFAULT_AS: Record<TextVariant, ElementType> = {
  "accent-header": "h1",
  "header-1": "h2",
  "header-2": "h3",
  large: "p",
  mid: "p",
  base: "p",
  small: "p",
  tools: "p",
};

export type TextProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  variant: TextVariant;
  /** HTML-тег или компонент. По умолчанию зависит от `variant`. */
  as?: ElementType;
  /** Без `text-foreground` — цвет наследуется от родителя (например, `Button`). */
  inheritColor?: boolean;
  className?: string;
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant, as, inheritColor, className, children, ...rest },
  ref,
) {
  const Comp = as ?? VARIANT_DEFAULT_AS[variant];

  return createElement(Comp, {
    ...rest,
    ref,
    className: cn(
      VARIANT_CLASS[variant],
      !inheritColor && "text-foreground",
      className,
    ),
    children,
  });
});
