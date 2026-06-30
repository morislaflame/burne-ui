import type { IconType } from "react-icons";
import { IoHelpCircleOutline } from "react-icons/io5";
import { Children, isValidElement, type ReactNode } from "react";

import {
  SEMANTIC_STATUS_ICONS,
} from "@/components/core/utils/semanticStatusIcons";

import type { AlertStatus, AlertVariant } from "./alertTypes";

export function resolveAlertVariant(variant?: AlertVariant): AlertVariant {
  return variant ?? "default";
}

export function resolveAlertStatus(status?: AlertStatus): AlertStatus {
  return status ?? "default";
}

function walkAlertChildren(
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

export function alertHasTitle(children: ReactNode): boolean {
  return walkAlertChildren(children, (name) => name === "AlertTitle");
}

export function alertHasDescription(children: ReactNode): boolean {
  return walkAlertChildren(children, (name) => name === "AlertDescription");
}

export function alertHasIndicator(children: ReactNode): boolean {
  return walkAlertChildren(children, (name) => name === "AlertIndicator");
}

function walkAlertIndicatorProps(
  node: ReactNode,
  visit: (props: { children?: ReactNode; status?: AlertStatus }) => void,
): void {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue;
    const displayName = (child.type as { displayName?: string }).displayName;
    if (displayName === "AlertIndicator") {
      visit(child.props as { children?: ReactNode; status?: AlertStatus });
    }
    walkAlertIndicatorProps((child.props as { children?: ReactNode }).children, visit);
  }
}

export function alertIndicatorWouldRender(
  variant: AlertVariant,
  status: AlertStatus,
  indicatorChildren: ReactNode | undefined,
  indicatorStatus?: AlertStatus,
): boolean {
  const effectiveStatus = indicatorStatus ?? status;
  if (indicatorChildren === null) return false;
  if (indicatorChildren !== undefined) return true;
  if (effectiveStatus !== "default") return true;
  return variant === "outline";
}

export function alertCompoundShowsIndicator(
  children: ReactNode,
  variant: AlertVariant,
  status: AlertStatus,
): boolean {
  if (!alertHasIndicator(children)) return false;
  let visible = false;
  walkAlertIndicatorProps(children, (props) => {
    if (alertIndicatorWouldRender(variant, status, props.children, props.status)) {
      visible = true;
    }
  });
  return visible;
}

export function alertHasAction(children: ReactNode): boolean {
  return walkAlertChildren(children, (name) => name === "AlertAction");
}

const ALERT_COMPOUND_SLOT_NAMES = new Set([
  "AlertMessage",
  "AlertIndicator",
  "AlertContent",
  "AlertTitle",
  "AlertDescription",
  "AlertAction",
]);

export function hasAlertCompoundChildren(children: ReactNode): boolean {
  return walkAlertChildren(children, (name) =>
    name != null && ALERT_COMPOUND_SLOT_NAMES.has(name),
  );
}

export function alertShowsDefaultIndicatorIcon(
  variant: AlertVariant,
  status: AlertStatus,
): boolean {
  if (status !== "default") return true;
  return variant === "outline";
}

export function alertDefaultIndicatorIcon(
  variant: AlertVariant,
  status: AlertStatus,
): IconType | null {
  if (status !== "default") return SEMANTIC_STATUS_ICONS[status];
  if (variant === "outline") return IoHelpCircleOutline;
  return null;
}

export function alertShowsIndicator(
  variant: AlertVariant,
  status: AlertStatus,
  icon: ReactNode | null | undefined,
  isCompound: boolean,
  children: ReactNode,
): boolean {
  if (isCompound) return alertCompoundShowsIndicator(children, variant, status);
  if (icon === null) return false;
  if (icon !== undefined) return true;
  return (
    alertShowsDefaultIndicatorIcon(variant, status) &&
    alertDefaultIndicatorIcon(variant, status) !== null
  );
}
