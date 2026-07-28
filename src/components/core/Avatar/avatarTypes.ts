import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type {
  TooltipSide,
  TooltipSize,
  TooltipVariant,
} from "@/components/core/Tooltip";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

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

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AvatarVariant;
  size?: AvatarSize;
  /** Visible fallback initials source (not a form label). Accessible name: `aria-label`, else trimmed `label`. */
  label?: string;
  src?: string;
  alt?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  nickname?: string;
  tooltipSize?: TooltipSize;
  tooltipVariant?: TooltipVariant;
  tooltipStatus?: SemanticStatus;
  tooltipSide?: TooltipSide;
  classNames?: Prettify<AvatarClassNames>;
};

export type UseAvatarRootStateProps = Pick<
  AvatarProps,
  | "variant"
  | "size"
  | "label"
  | "nickname"
  | "tooltipSize"
  | "tooltipVariant"
  | "tooltipStatus"
  | "tooltipSide"
  | "children"
  | "role"
> & {
  "aria-label"?: string;
};

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  classNames?: Prettify<AvatarClassNames>;
};

export type AvatarClassNamesProviderProps = {
  classNames?: Prettify<AvatarClassNames>;
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
