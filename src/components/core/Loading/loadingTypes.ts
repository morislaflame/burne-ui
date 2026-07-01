import type { HTMLAttributes } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type LoadingSize = ComponentSize;

export type LoadingVariant = "spinner" | "dots";

export type LoadingColor =
  | "primary"
  | "foreground"
  | "muted"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "warning";

export type LoadingProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: LoadingColor;
  label?: string;
};

export type LoadingDotsLayout = {
  dotClass: string;
  dotSizeVar: string;
  gapClass: string;
  jumpPx: number;
  scalePeak: number;
};
