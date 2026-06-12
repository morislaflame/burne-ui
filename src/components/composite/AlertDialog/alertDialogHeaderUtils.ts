import { Children, isValidElement, type ReactNode } from "react";

import type { AlertStatus } from "@/components/core/Alert/alertUtils";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

import type { IconType } from "react-icons";
import { IoHelpCircleOutline } from "react-icons/io5";

import {
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";

const ALERT_DIALOG_HEADER_SLOT_NAMES = new Set([
  "AlertDialogIndicator",
  "AlertDialogTitle",
  "AlertDialogDescription",
  "AlertDialogClose",
  "AlertDialogHeadingBlock",
]);

function walkAlertDialogHeaderChildren(
  node: ReactNode,
  match: (displayName: string | undefined) => boolean,
): boolean {
  let found = false;

  const walk = (current: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(current)) {
      if (!isValidElement(child)) continue;
      const displayName = (child.type as { displayName?: string }).displayName;
      if (match(displayName)) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(node);
  return found;
}

export function alertDialogHasTitle(children: ReactNode): boolean {
  return walkAlertDialogHeaderChildren(children, (name) => name === "AlertDialogTitle");
}

export function alertDialogHasDescription(children: ReactNode): boolean {
  return walkAlertDialogHeaderChildren(
    children,
    (name) => name === "AlertDialogDescription",
  );
}

export function alertDialogHasIndicator(children: ReactNode): boolean {
  return walkAlertDialogHeaderChildren(
    children,
    (name) => name === "AlertDialogIndicator",
  );
}

export function alertDialogHasClose(children: ReactNode): boolean {
  return walkAlertDialogHeaderChildren(
    children,
    (name) => name === "AlertDialogClose",
  );
}

export function hasAlertDialogHeaderCompoundChildren(children: ReactNode): boolean {
  return walkAlertDialogHeaderChildren(
    children,
    (name) => name != null && ALERT_DIALOG_HEADER_SLOT_NAMES.has(name),
  );
}

export function alertDialogShowsDefaultHeaderIcon(tone: AlertStatus): boolean {
  return tone !== "default" && tone !== "secondary";
}

export function alertDialogDefaultHeaderIcon(tone: AlertStatus): IconType | null {
  if (tone === "default" || tone === "secondary") return null;
  if (tone === "outline") return IoHelpCircleOutline;
  return SEMANTIC_STATUS_ICONS[tone as SemanticStatus];
}

export function alertDialogShowsIndicator(
  tone: AlertStatus,
  icon: ReactNode | null | undefined,
  compoundHasIndicator: boolean,
): boolean {
  if (compoundHasIndicator) return true;
  if (icon === null) return false;
  if (icon !== undefined) return true;
  return (
    alertDialogShowsDefaultHeaderIcon(tone) &&
    alertDialogDefaultHeaderIcon(tone) !== null
  );
}

export function resolveAlertDialogHeaderGridSlots(
  tone: AlertStatus,
  icon: ReactNode | null | undefined,
  showClose: boolean,
  children: ReactNode,
): MessageBannerGridSlots {
  const compoundHasIndicator = alertDialogHasIndicator(children);
  const compoundHasClose = alertDialogHasClose(children);

  return {
    hasIndicator: alertDialogShowsIndicator(tone, icon, compoundHasIndicator),
    hasTitle: alertDialogHasTitle(children),
    hasDescription: alertDialogHasDescription(children),
    hasAction: false,
    hasClose: compoundHasClose || showClose,
  };
}

export function alertDialogHeaderIconWrapperClass(tone: AlertStatus): string {
  switch (tone) {
    case "danger":
      return "text-danger";
    case "success":
      return "text-success";
    case "info":
      return "text-info";
    case "warning":
      return "text-warning";
    default:
      return "text-primary";
  }
}
