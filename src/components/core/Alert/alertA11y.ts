import type { AlertLiveRole, AlertStatus } from "./alertTypes";

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
