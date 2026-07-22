import { ToastAction, ToastClose, ToastContent, ToastDescription, ToastIndicator, ToastMessage, ToastProviderRoot, ToastRoot, ToastTitle } from "./Toast";

export const Toast = Object.assign(ToastRoot, {
  Provider: ToastProviderRoot,
  Message: ToastMessage,
  Indicator: ToastIndicator,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
});

export { ToastContext, useToastContext, useToastClassNames } from "./toastContext";
export { useToast } from "./useToast";

export type {
  ToastClassNames,
  ToastStatus,
  ToastPlacement,
  ToastProviderProps,
  ToastProps,
  ToastIndicatorProps,
  ToastMessageProps,
  ToastContentProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionProps,
  ToastCloseProps,
  AddToastOpts,
  PromiseToastOpts,
  ToastVariant,
  ToastSize,
  ToastContextValue,
} from "./toastTypes";
