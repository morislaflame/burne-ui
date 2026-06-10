import { forwardRef, type HTMLAttributes } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { cn } from "@/utils/cn";

export type LoadingSize = ComponentSize;

export type LoadingColor =
  | "accent"
  | "foreground"
  | "muted"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "warning";

export type LoadingProps = HTMLAttributes<HTMLSpanElement> & {
  /** Габариты индикатора. По умолчанию `base`. */
  size?: LoadingSize;
  /** Цвет кольца. По умолчанию `accent`. */
  color?: LoadingColor;
  /** Текст для screen readers. По умолчанию «Загрузка». */
  label?: string;
};

const LOADING_RING: Record<LoadingSize, { icon: string; border: string }> = {
  small: {
    icon: CONTROL_SIZE_LAYOUT.small.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.small.spinnerBorder,
  },
  base: {
    icon: CONTROL_SIZE_LAYOUT.base.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.base.spinnerBorder,
  },
  mid: {
    icon: CONTROL_SIZE_LAYOUT.mid.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.mid.spinnerBorder,
  },
  large: {
    icon: CONTROL_SIZE_LAYOUT.large.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.large.spinnerBorder,
  },
};

const LOADING_COLOR: Record<LoadingColor, string> = {
  accent: "text-primary",
  foreground: "text-foreground",
  muted: "text-muted",
  secondary: "text-primary",
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

/**
 * Круговой индикатор загрузки: размеры как у спиннера в `Button`, цвета — основные токены темы.
 */
export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(function Loading(
  {
    size = "base",
    color = "accent",
    label = "Загрузка",
    className = "",
    ...rest
  },
  ref,
) {
  const ring = LOADING_RING[size];

  return (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          "box-border inline-block rounded-full border-current border-t-transparent",
          "animate-spin motion-reduce:animate-none",
          ring.icon,
          ring.border,
          LOADING_COLOR[color],
        )}
      />
    </span>
  );
});

Loading.displayName = "Loading";
