import type { ElementType, HTMLAttributes } from "react";

export type TextVariant =
  | "accent-header"
  | "header-1"
  | "header-2"
  | "large"
  | "mid"
  | "base"
  | "small"
  | "xsmall";

export type TextProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  variant: TextVariant;
  as?: ElementType;
  inheritColor?: boolean;
  className?: string;
};
