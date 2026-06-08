import type { TextVariant } from "@/components/core/Text";

import type { AlertDialogSize } from "./alertDialogTypes";

export type AlertDialogSizePreset = {
  panelMax: string;
  maxHeight: string;
  headerGap: string;
  headerPad: string;
  bodyPad: string;
  footerPad: string;
  headingBlockGap: string;
  iconClass: string;
  titleVariant: TextVariant;
  descVariant: TextVariant;
  descClassName: string;
  bodyVariant: TextVariant;
};

export const ALERT_DIALOG_SIZE: Record<AlertDialogSize, AlertDialogSizePreset> = {
  small: {
    panelMax: "max-w-component-small",
    maxHeight: "max-h-[min(85dvh,26rem)]",
    headerGap: "gap-base",
    headerPad: "px-plus pt-plus pb-base",
    bodyPad: "py-base px-plus",
    footerPad: "py-base px-plus gap-small",
    headingBlockGap: "flex min-w-0 flex-col gap-xsmall",
    iconClass: "icon-base",
    titleVariant: "small",
    descVariant: "small",
    descClassName: "text-muted",
    bodyVariant: "small",
  },
  base: {
    panelMax: "max-w-component-mid",
    maxHeight: "max-h-[min(90dvh,36rem)]",
    headerGap: "gap-plus",
    headerPad: "px-mid pt-mid pb-plus",
    bodyPad: "py-plus px-mid",
    footerPad: "py-plus px-mid gap-base",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-large",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  mid: {
    panelMax: "max-w-component-mid",
    maxHeight: "max-h-[min(90dvh,40rem)]",
    headerGap: "gap-plus",
    headerPad: "px-mid pt-mid pb-mid",
    bodyPad: "py-mid px-mid",
    footerPad: "py-mid px-mid gap-base",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-xlarge",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  large: {
    panelMax: "max-w-component-large",
    maxHeight: "max-h-[min(90dvh,44rem)]",
    headerGap: "gap-plus",
    headerPad: "px-large pt-large pb-mid",
    bodyPad: "py-mid px-large",
    footerPad: "py-mid px-mid gap-plus",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-2xlarge",
    titleVariant: "large",
    descVariant: "mid",
    descClassName: "text-muted",
    bodyVariant: "mid",
  },
};
