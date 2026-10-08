import type { TextVariant } from "@/components/core/Text";

import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { AvatarSize, AvatarVariant } from "./avatarTypes";
import { KIT_AVATAR_VARIANTS } from "./avatarTypes";

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

const AVATAR_KIT_SURFACE = "rounded-full bg-surface border-token";

export function avatarRootClass(
  size: AvatarSize,
  variant: AvatarVariant,
  className?: string,
): string {
  const visual = resolveVariantVisual(variant, KIT_AVATAR_VARIANTS, "avatar.root");
  return cn(
    "relative inline-flex shrink-0 select-none overflow-hidden text-start",
    visual.className !== undefined ? visual.className : AVATAR_KIT_SURFACE,
    AVATAR_SIZE_CLASS[size].root,
    className,
  );
}

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
  return cn("flex flex-row flex-nowrap items-center text-start", className);
}

export function avatarGroupItemClass(stackIndex: number, className?: string): string {
  return cn("relative inline-flex", stackIndex > 0 && "-ms-mid", className);
}

export const AVATAR_GROUP_ITEM_TRANSFORM_ORIGIN = "center bottom";
