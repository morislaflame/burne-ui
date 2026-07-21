import { Children, cloneElement, Fragment, isValidElement, type ReactElement, type ReactNode } from "react";

import { alertDefaultIndicatorIcon, alertShowsDefaultIndicatorIcon } from "@/components/core/Alert/alertAPI";
import type { AlertStatus, AlertVariant } from "@/components/core/Alert/alertTypes";
import { Button, type ButtonProps, type ButtonSize, type ButtonStatus, type ButtonVariant } from "@/components/core/Button";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
/** Primary action button in the modal footer in the window tone. */
export function primaryButtonVariantForAlertTone(
  status: AlertStatus,
): ButtonVariant {
  void status;
  return "primary";
}

/** Status of the primary action button in the modal footer in the window tone. */
export function primaryButtonStatusForAlertTone(
  status: AlertStatus,
): ButtonStatus {
  switch (status) {
    case "danger":
    case "success":
    case "info":
    case "warning":
      return status;
    default:
      return "default";
  }
}

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

export function injectFooterButtonSize(
  children: ReactNode,
  buttonSize: ButtonSize,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (child.type === Button) {
      const props = child.props as ButtonProps;
      return cloneElement(child as ReactElement<ButtonProps>, {
        size: props.size ?? buttonSize,
      });
    }
    if (child.type === Fragment) {
      const f = child as ReactElement<{ children?: ReactNode }>;
      return cloneElement(
        f,
        { key: f.key ?? undefined },
        injectFooterButtonSize(f.props.children, buttonSize),
      );
    }
    return child;
  });
}
