import type { TextVariant } from "@/components/core/Text";

import type { ComponentSize } from "./componentSize";
import { resolveComponentSize } from "./componentSize";
import { CONTROL_SIZE_LAYOUT } from "./control";

export type PanelSize = ComponentSize;

/** Alias — Card shares the panel size grid. */
export type CardSize = PanelSize;

/**
 * Shared size grid for surface panels:
 * Dialog, AlertDialog, Popover, Card, Drawer.
 */
export type PanelSizeLayout = {
  rounded: string;
  /** Dialog / AlertDialog max width */
  panelMax: string;
  /** Popover min width */
  panelMin: string;
  /** Popover max width */
  popoverMax: string;
  maxHeight: string;
  /** Dialog / AlertDialog / Card / Drawer header padding */
  headerPadding: string;
  /** Dialog / AlertDialog / Card / Drawer body padding */
  bodyPadding: string;
  /** Dialog / AlertDialog / Card / Drawer footer padding */
  footerPadding: string;
  /** Popover single-block content padding */
  contentPadding: string;
  /** Dialog header row gap (heading block | close) — not for title↔description */
  headerGap: string;
  /** AlertDialog header grid gap (indicator | title) */
  alertHeaderGap: string;
  /** Title + description stack gap */
  headingGap: string;
  /** Popover default content gap class */
  contentGap: string;
  titleVariant: TextVariant;
  /** AlertDialog title (can read larger than panel title) */
  alertTitleVariant: TextVariant;
  descVariant: TextVariant;
  bodyVariant: TextVariant;
  descClassName: string;
  /** AlertDialog status icon box */
  iconClass: string;
  footerButtonSize: ComponentSize;
  /** Dialog / AlertDialog / Drawer header CloseButton */
  closeButtonSize: ComponentSize;
};

export const PANEL_SIZE_LAYOUT: Record<PanelSize, PanelSizeLayout> = {
  small: {
    rounded: CONTROL_SIZE_LAYOUT.small.rounded,
    panelMax: "max-w-component-base",
    panelMin: "min-w-component-xsmall",
    popoverMax: "max-w-component-small",
    maxHeight: "max-h-[min(85dvh,26rem)]",
    headerPadding: "px-mid py-base",
    bodyPadding: "px-mid py-base",
    footerPadding: "px-mid py-base",
    contentPadding: "px-mid py-base",
    headerGap: "gap-base",
    alertHeaderGap: "gap-x-base",
    headingGap: "gap-small",
    contentGap: "gap-base",
    titleVariant: "base",
    alertTitleVariant: "base",
    descVariant: "small",
    bodyVariant: "small",
    descClassName: "text-muted",
    iconClass: "icon-mid",
    footerButtonSize: "small",
    closeButtonSize: "small",
  },
  base: {
    rounded: CONTROL_SIZE_LAYOUT.base.rounded,
    panelMax: "max-w-component-large",
    panelMin: "min-w-component-small",
    popoverMax: "max-w-component-base",
    maxHeight: "max-h-[min(90dvh,36rem)]",
    headerPadding: "px-mid py-base",
    bodyPadding: "px-mid py-base",
    footerPadding: "px-mid py-base",
    contentPadding: "px-mid py-base",
    headerGap: "gap-base",
    alertHeaderGap: "gap-x-mid gap-y-xsmall",
    headingGap: "gap-xsmall",
    contentGap: "gap-mid",
    titleVariant: "mid",
    alertTitleVariant: "mid",
    descVariant: "base",
    bodyVariant: "base",
    descClassName: "text-muted",
    iconClass: "icon-large",
    footerButtonSize: "base",
    closeButtonSize: "small",
  },
  mid: {
    rounded: CONTROL_SIZE_LAYOUT.mid.rounded,
    panelMax: "max-w-component-xlarge",
    panelMin: "min-w-component-small",
    popoverMax: "max-w-component-mid",
    maxHeight: "max-h-[min(90dvh,40rem)]",
    headerPadding: "px-large py-mid",
    bodyPadding: "px-large py-mid",
    footerPadding: "px-large py-mid",
    contentPadding: "px-large py-mid",
    headerGap: "gap-mid",
    alertHeaderGap: "gap-x-mid gap-y-small",
    headingGap: "gap-base",
    contentGap: "gap-mid",
    titleVariant: "large",
    alertTitleVariant: "mid",
    descVariant: "base",
    bodyVariant: "base",
    descClassName: "text-muted",
    iconClass: "icon-large",
    footerButtonSize: "base",
    closeButtonSize: "base",
  },
  large: {
    rounded: CONTROL_SIZE_LAYOUT.large.rounded,
    panelMax: "max-w-component-2xlarge",
    panelMin: "min-w-component-base",
    popoverMax: "max-w-component-large",
    maxHeight: "max-h-[min(90dvh,44rem)]",
    headerPadding: "px-large py-mid",
    bodyPadding: "px-large py-mid",
    footerPadding: "px-large py-mid",
    contentPadding: "px-xlarge py-large",
    headerGap: "gap-mid",
    alertHeaderGap: "gap-x-mid gap-y-small",
    headingGap: "gap-base",
    contentGap: "gap-large",
    titleVariant: "large",
    alertTitleVariant: "large",
    descVariant: "mid",
    bodyVariant: "mid",
    descClassName: "text-muted",
    iconClass: "icon-large",
    footerButtonSize: "base",
    closeButtonSize: "base",
  },
};

export function resolvePanelSize(size?: PanelSize): PanelSize {
  return resolveComponentSize(size);
}

export function panelSizeLayout(size?: PanelSize): PanelSizeLayout {
  return PANEL_SIZE_LAYOUT[resolvePanelSize(size)];
}

export const resolveCardSize = resolvePanelSize;
export const cardSizeLayout = panelSizeLayout;
export const CARD_SIZE_LAYOUT = PANEL_SIZE_LAYOUT;
