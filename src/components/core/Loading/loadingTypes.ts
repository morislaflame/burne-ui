import type { HTMLAttributes } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type LoadingSize = ComponentSize;

export type LoadingType = "spinner" | "dots";

export type LoadingColor =
  | "primary"
  | "foreground"
  | "muted"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "warning";

export type LoadingClassNames = {
  root?: string;
  spinner?: string;
  dots?: string;
  dot?: string;
};

export type LoadingProps = HTMLAttributes<HTMLSpanElement> & {
  type?: LoadingType;
  size?: LoadingSize;
  color?: LoadingColor;
  label?: string;
  classNames?: LoadingClassNames;
};

export type LoadingDotsLayout = {
  dotClass: string;
  dotSizeVar: string;
  gapClass: string;
  jumpPx: number;
  scalePeak: number;
};
