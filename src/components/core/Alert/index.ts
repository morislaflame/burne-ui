import {
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertMessage,
  AlertRoot,
  AlertTitle,
} from "./Alert";

export const Alert = Object.assign(AlertRoot, {
  Indicator: AlertIndicator,
  Message: AlertMessage,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Action: AlertAction,
});

export { resolveAlertStatus } from "./alertUtils";

export type {
  AlertProps,
  AlertVariant,
  AlertStatus,
  AlertIndicatorProps,
  AlertContentProps,
  AlertMessageProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
} from "./Alert";
export { resolveAlertLiveRole, type AlertLiveRole } from "./alertUtils";
