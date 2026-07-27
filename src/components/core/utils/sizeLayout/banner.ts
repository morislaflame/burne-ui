import type { TextVariant } from "@/components/core/Text";

import type { ComponentSize } from "./componentSize";
import { resolveComponentSize } from "./componentSize";
import { CONTROL_SIZE_LAYOUT } from "./control";

export type MessageBannerSize = ComponentSize;

/** Loading spinner size step — mirrors ComponentSize without importing Loading. */
export type MessageBannerLoadingSize = ComponentSize;

export type MessageBannerSizePreset = {
  maxWidthClass: string;
  shellPadding: string;
  gridGap: string;
  iconSvgClass: string;
  titleVariant: TextVariant;
  descVariant: TextVariant;
  loadingSize: MessageBannerLoadingSize;
  toastWidthPx: number;
};

/** Shared size presets for Alert / Toast shells. */
export const MESSAGE_BANNER_SIZE: Record<MessageBannerSize, MessageBannerSizePreset> = {
  small: {
    maxWidthClass: "max-w-component-base",
    shellPadding: `${CONTROL_SIZE_LAYOUT.small.rounded} p-base`,
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-small",
    titleVariant: "small",
    descVariant: "xsmall",
    loadingSize: "small",
    toastWidthPx: 280,
  },
  base: {
    maxWidthClass: "max-w-component-large",
    shellPadding: `${CONTROL_SIZE_LAYOUT.base.rounded} p-mid`,
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-mid",
    titleVariant: "base",
    descVariant: "small",
    loadingSize: "small",
    toastWidthPx: 360,
  },
  mid: {
    maxWidthClass: "max-w-component-xlarge",
    shellPadding: `${CONTROL_SIZE_LAYOUT.mid.rounded} p-mid`,
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-large",
    titleVariant: "mid",
    descVariant: "base",
    loadingSize: "base",
    toastWidthPx: 400,
  },
  large: {
    maxWidthClass: "max-w-component-2xlarge",
    shellPadding: `${CONTROL_SIZE_LAYOUT.large.rounded} p-large`,
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-large",
    titleVariant: "large",
    descVariant: "base",
    loadingSize: "mid",
    toastWidthPx: 440,
  },
};

export function resolveMessageBannerSize(size?: MessageBannerSize): MessageBannerSize {
  return resolveComponentSize(size);
}

export function messageBannerSizePreset(size?: MessageBannerSize): MessageBannerSizePreset {
  return MESSAGE_BANNER_SIZE[resolveMessageBannerSize(size)];
}

export function alertRootShellClass(size?: MessageBannerSize): string {
  const preset = messageBannerSizePreset(size);
  return `w-fit ${preset.maxWidthClass} ${preset.shellPadding}`;
}

export function toastViewportWidthPx(
  entries: ReadonlyArray<{ size?: MessageBannerSize }>,
  fallbackSize: MessageBannerSize = "base",
): number {
  const fallback = messageBannerSizePreset(fallbackSize).toastWidthPx;
  if (entries.length === 0) return fallback;
  return Math.max(
    fallback,
    ...entries.map((entry) => messageBannerSizePreset(entry.size ?? fallbackSize).toastWidthPx),
  );
}
