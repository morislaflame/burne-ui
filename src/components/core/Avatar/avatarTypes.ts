import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type {
  TooltipSide,
  TooltipSize,
  TooltipVariant,
} from "@/components/core/Tooltip";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export type AvatarSize = "small" | "base" | "mid" | "large";
 
export const KIT_AVATAR_VARIANTS = ["default"] as const;
export type KitAvatarVariant = (typeof KIT_AVATAR_VARIANTS)[number];
export type AvatarVariant = KitAvatarVariant | (string & {});
 
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
};
 
export type AvatarPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type AvatarMotion = {
  root?: AvatarPartMotion;
  image?: Pick<AvatarPartMotion, "enter" | "leave">;
  fallback?: AvatarPartMotion;
  groupItem?: Pick<AvatarPartMotion, "hoverIn" | "hoverOut">;
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
  /**
   * Per-slot motion (`root`, `image`, `fallback`). Image fade: `enter` / `leave`.
   * Group item hover is `motion.groupItem` on `Avatar.Group`.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<AvatarMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
 
export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  motion?: Prettify<Pick<AvatarPartMotion, "enter" | "leave">>;
};
 
export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<AvatarPartMotion>;
};
 
export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  classNames?: Prettify<AvatarClassNames>;
  /**
   * Per-item hover on the group wrap (`groupItem`).
   */
  motion?: Prettify<Pick<AvatarMotion, "groupItem">>;
};
 
export type AvatarClassNamesProviderProps = {
  classNames?: Prettify<AvatarClassNames>;
  children: ReactNode;
};
 
export type AvatarGroupMotionProviderProps = {
  motion?: Prettify<Pick<AvatarMotion, "groupItem">>;
  children: ReactNode;
};
 
export type AvatarSimpleContentProps = {
  src?: string;
  alt?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
};
 
export type AvatarShellProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  size: AvatarSize;
  variant: AvatarVariant;
  children: ReactNode;
};
 
export type AvatarGroupItemProps = {
  stackIndex: number;
  children: ReactNode;
};
 