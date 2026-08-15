import { AlertAction, AlertContent, AlertDescription, AlertIndicator, AlertMessage, AlertRoot, AlertTitle } from "./Alert";

export const Alert = Object.assign(AlertRoot, {
  Indicator: AlertIndicator,
  Message: AlertMessage,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Action: AlertAction,
});

export { resolveAlertStatus, resolveAlertVariant } from "./alertAPI";

export type {
  AlertProps,
  AlertVariant,
  AlertStatus,
  AlertSize,
  AlertClassNames,
  AlertMotion,
  AlertPartMotion,
  AlertIndicatorProps,
  AlertContentProps,
  AlertMessageProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
} from "./Alert";
export { resolveAlertLiveRole } from "./alertA11y";
export type { AlertLiveRole } from "./alertTypes";
