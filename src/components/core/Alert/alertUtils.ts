import { Children, isValidElement, type ReactNode } from "react";

/** Семантический тон алерта и заливки. */
export type AlertStatus =
  | "default"
  | "outline"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "warning";

export type AlertLiveRole = "status" | "alert";

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

/** `alert` для срочных тонов; иначе `status`. */
export function resolveAlertLiveRole(status: AlertStatus, roleProp?: AlertLiveRole): AlertLiveRole {
  if (roleProp != null) return roleProp;
  if (status === "danger" || status === "warning") return "alert";
  return "status";
}

export function resolveAlertAriaLabelledBy(
  titleId: string,
  descriptionId: string,
  hasTitle: boolean,
  hasDescription: boolean,
): string | undefined {
  if (hasTitle) return titleId;
  if (hasDescription) return descriptionId;
  return undefined;
}

export function resolveAlertAriaDescribedBy(
  descriptionId: string,
  hasTitle: boolean,
  hasDescription: boolean,
): string | undefined {
  if (hasTitle && hasDescription) return descriptionId;
  return undefined;
}

export function resolveAlertStatus(status?: AlertStatus): AlertStatus {
  return status ?? "default";
}
