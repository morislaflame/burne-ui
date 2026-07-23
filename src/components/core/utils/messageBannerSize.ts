import type { TextVariant } from "@/components/core/Text";
import type { LoadingSize } from "@/components/core/Loading/loadingTypes";

import type { ComponentSize } from "./componentSize";

export type MessageBannerSize = ComponentSize;

export type MessageBannerSizePreset = {
  maxWidthClass: string;
  shellPadding: string;
  gridGap: string;
  iconSvgClass: string;
  titleVariant: TextVariant;
  descVariant: TextVariant;
  loadingSize: LoadingSize;
  toastWidthPx: number;
};

export const MESSAGE_BANNER_SIZE: Record<MessageBannerSize, MessageBannerSizePreset> = {
  small: {
    maxWidthClass: "max-w-component-small",
    shellPadding: "rounded-mid py-small px-base",
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-small",
    titleVariant: "small",
    descVariant: "xsmall",
    loadingSize: "small",
    toastWidthPx: 280,
  },
  base: {
    maxWidthClass: "max-w-component-base",
    shellPadding: "rounded-mid py-base px-plus",
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-plus",
    titleVariant: "base",
    descVariant: "small",
    loadingSize: "small",
    toastWidthPx: 360,
  },
  mid: {
    maxWidthClass: "max-w-component-mid",
    shellPadding: "rounded-mid py-base px-plus",
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-mid",
    titleVariant: "mid",
    descVariant: "base",
    loadingSize: "base",
    toastWidthPx: 400,
  },
  large: {
    maxWidthClass: "max-w-component-large",
    shellPadding: "rounded-mid py-plus px-plus",
    gridGap: "gap-x-base gap-y-xsmall",
    iconSvgClass: "[&_svg]:icon-mid",
    titleVariant: "large",
    descVariant: "base",
    loadingSize: "mid",
    toastWidthPx: 440,
  },
};

export function resolveMessageBannerSize(size?: MessageBannerSize): MessageBannerSize {
  return size ?? "base";
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
