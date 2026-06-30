import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";

import type {
  TooltipSide,
  TooltipSize,
  TooltipVariant,
} from "@/components/core/Tooltip";

export type AvatarSize = "small" | "base" | "mid" | "large";

export type AvatarVariant = "default" | "gloss";

export type ImageStatus = "idle" | "loaded" | "error";

export type AvatarContextValue = {
  size: AvatarSize;
  label: string | undefined;
  imageStatus: ImageStatus;
  onImageLoad: () => void;
  onImageError: () => void;
};

export type AvatarClassNames = {
  root?: string;
  image?: string;
  fallback?: string;
  group?: string;
  groupItem?: string;
  glossWrap?: string;
};

export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> & {
  variant?: AvatarVariant;
  size?: AvatarSize;
  label?: string;
  src?: string;
  alt?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  nickname?: string;
  tooltipSize?: TooltipSize;
  tooltipVariant?: TooltipVariant;
  tooltipSide?: TooltipSide;
  classNames?: AvatarClassNames;
};

export type UseAvatarRootStateProps = Pick<
  AvatarProps,
  | "variant"
  | "size"
  | "label"
  | "nickname"
  | "tooltipSize"
  | "tooltipVariant"
  | "tooltipSide"
  | "children"
  | "role"
>;

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  classNames?: AvatarClassNames;
};

export type AvatarClassNamesProviderProps = {
  classNames?: AvatarClassNames;
  children: ReactNode;
};

export type AvatarSimpleContentProps = {
  src?: string;
  alt?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
};

export type AvatarShellProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  size: AvatarSize;
  children: ReactNode;
};

export type AvatarGroupItemProps = {
  stackIndex: number;
  children: ReactNode;
};
