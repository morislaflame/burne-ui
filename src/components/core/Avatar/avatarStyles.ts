import type { TextVariant } from "@/components/core/Text";

import { cn } from "@/utils/cn";

import type { AvatarSize } from "./avatarTypes";

export const AVATAR_SIZE_CLASS: Record<AvatarSize, { root: string }> = {
  small: { root: "avatar-size-small" },
  base: { root: "avatar-size-base" },
  mid: { root: "avatar-size-mid" },
  large: { root: "avatar-size-large" },
};

export const AVATAR_FALLBACK_TEXT: Record<
  AvatarSize,
  { variant: TextVariant; className: string }
> = {
  small: { variant: "small", className: "font-w-strong uppercase" },
  base: { variant: "base", className: "font-w-strong uppercase" },
  mid: { variant: "mid", className: "font-w-strong uppercase" },
  large: { variant: "header-2", className: "font-w-strong uppercase" },
};

export function avatarRootClass(
  size: AvatarSize,
  isGloss: boolean,
  className?: string,
): string {
  return cn(
    "relative inline-flex shrink-0 select-none overflow-hidden text-left",
    isGloss
      ? cn("gloss-panel size-full rounded-full border-token", AVATAR_SIZE_CLASS[size].root)
      : cn("rounded-full bg-surface border-token", AVATAR_SIZE_CLASS[size].root),
    !isGloss && className,
  );
}

export function avatarGlossWrapClass(size: AvatarSize, className?: string): string {
  return cn(
    "gloss-wrap inline-flex shrink-0 rounded-full",
    AVATAR_SIZE_CLASS[size].root,
    className,
  );
}

export const AVATAR_GLOSS_SHADOW_CLASS = "gloss-shadow rounded-full";

export function avatarImageClass(visible: boolean, className?: string): string {
  return cn(
    "absolute inset-0 z-[1] size-full object-cover",
    !visible && "pointer-events-none",
    className,
  );
}

export function avatarFallbackClass(show: boolean, className?: string): string {
  return cn(
    "absolute inset-0 z-0 flex items-center justify-center bg-primary-tint text-primary",
    show ? "opacity-100" : "pointer-events-none opacity-0",
    className,
  );
}

export function avatarGroupClass(className?: string): string {
  return cn("flex flex-row flex-nowrap items-center text-left", className);
}

export function avatarGroupItemClass(stackIndex: number, className?: string): string {
  return cn("relative inline-flex will-change-transform", stackIndex > 0 && "-ml-plus", className);
}

export const AVATAR_GROUP_ITEM_TRANSFORM_ORIGIN = "center bottom";
