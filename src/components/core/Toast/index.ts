import {
  ToastActionButton,
  ToastCloseButton,
  ToastContent,
  ToastDescription,
  ToastIndicator,
  ToastProviderRoot,
  ToastRoot,
  ToastTitle,
} from "./Toast";
export const Toast = Object.assign(ToastRoot, {
  Provider: ToastProviderRoot,
  Indicator: ToastIndicator,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  ActionButton: ToastActionButton,
  CloseButton: ToastCloseButton,
});

export { ToastContext, useToastContext } from "./toastContext";
export { useToast } from "./useToast";

export type {
  ToastStatus,
  ToastPlacement,
  ToastProviderProps,
  ToastRootProps,
  ToastIndicatorProps,
  ToastContentProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionButtonProps,
  ToastCloseButtonProps,
  AddToastOpts,
  PromiseToastOpts,
} from "./Toast";
export type { ToastContextValue } from "./toastContext";
