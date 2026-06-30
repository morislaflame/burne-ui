import { Children, isValidElement, type ReactNode } from "react";

import type { AlertStatus, AlertVariant } from "@/components/core/Alert/alertTypes";
import {
  alertDefaultIndicatorIcon,
  alertShowsDefaultIndicatorIcon,
} from "@/components/core/Alert/alertAPI";
import { alertIndicatorWrapperTextClass } from "@/components/core/Alert/alertStyles";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

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

export function alertDialogShowsDefaultHeaderIcon(
  variant: AlertVariant,
  status: AlertStatus,
): boolean {
  return alertShowsDefaultIndicatorIcon(variant, status);
}

export function alertDialogDefaultHeaderIcon(
  variant: AlertVariant,
  status: AlertStatus,
) {
  return alertDefaultIndicatorIcon(variant, status);
}

export function alertDialogShowsIndicator(
  variant: AlertVariant,
  status: AlertStatus,
  icon: ReactNode | null | undefined,
  compoundHasIndicator: boolean,
): boolean {
  if (compoundHasIndicator) return true;
  if (icon === null) return false;
  if (icon !== undefined) return true;
  return (
    alertDialogShowsDefaultHeaderIcon(variant, status) &&
    alertDialogDefaultHeaderIcon(variant, status) !== null
  );
}

export function resolveAlertDialogHeaderGridSlots(
  variant: AlertVariant,
  status: AlertStatus,
  icon: ReactNode | null | undefined,
  showClose: boolean,
  children: ReactNode,
): MessageBannerGridSlots {
  const compoundHasIndicator = alertDialogHasIndicator(children);
  const compoundHasClose = alertDialogHasClose(children);

  return {
    hasIndicator: alertDialogShowsIndicator(variant, status, icon, compoundHasIndicator),
    hasTitle: alertDialogHasTitle(children),
    hasDescription: alertDialogHasDescription(children),
    hasAction: false,
    hasClose: compoundHasClose || showClose,
  };
}

export function alertDialogHeaderIconWrapperClass(status: AlertStatus): string {
  return alertIndicatorWrapperTextClass(status);
}
