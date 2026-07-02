import type { TextVariant } from "@/components/core/Text";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";

import { mergeLinkSlotClass } from "./linkAPI";
import type { LinkSize } from "./linkTypes";

export const LINK_ANCHOR_CLASS =
  "group/link inline-flex max-w-full min-w-0 items-center gap-xsmall rounded-mid no-underline outline-none w-fit text-primary focus-ring";

export const LINK_TEXT_BASE_CLASS = "min-w-0 truncate font-w-mid";

export const LINK_TEXT_UNDERLINE_CLASS =
  "underline decoration-current/70 underline-offset-[0.2em]";

export const LINK_ICON_MUTED_CLASS =
  "text-muted group-hover/link:text-primary group-focus-visible/link:text-primary";

export const LINK_ICON_PRIMARY_CLASS = "text-primary";

export const LINK_DEFAULT_ICON_ROTATE_CLASS = "rotate-[-45deg]";

export const LINK_TEXT_VARIANT: Record<LinkSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

export const LINK_ICON_SIZE_CLASS: Record<LinkSize, string> = {
  small: "icon-small",
  base: "icon-base",
  mid: "icon-mid",
  large: "icon-large",
};

export function linkAnchorClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergeLinkSlotClass(LINK_ANCHOR_CLASS, slotClass, className);
}

export function linkTextClass({
  underline,
  slotClass,
}: {
  underline: boolean;
  slotClass?: string;
}): string {
  return mergeLinkSlotClass(
    LINK_TEXT_BASE_CLASS,
    underline && LINK_TEXT_UNDERLINE_CLASS,
    slotClass,
  );
}

export function linkIconSlotClass({
  size,
  muted,
  slotClass,
}: {
  size: LinkSize;
  muted: boolean;
  slotClass?: string;
}): string {
  return mergeLinkSlotClass(
    TEXT_COLOR_TRANSITION,
    LINK_ICON_SIZE_CLASS[size],
    "[&_svg]:size-full",
    muted ? LINK_ICON_MUTED_CLASS : LINK_ICON_PRIMARY_CLASS,
    slotClass,
  );
}

export function linkDefaultIconClass(size: LinkSize): string {
  return mergeLinkSlotClass(
    LINK_ICON_SIZE_CLASS[size],
    LINK_DEFAULT_ICON_ROTATE_CLASS,
  );
}
