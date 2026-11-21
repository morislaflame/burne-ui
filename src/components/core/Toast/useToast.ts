import { useCallback } from "react";

import { useBurneLabel } from "@/theme/BurneLabelsProvider";
 
import type { AddToastOpts, PromiseToastOpts, ToastStatus } from "./toastTypes";
import { TOAST_DEFAULT_DURATION_MS } from "./toastAPI";
import { useToastContext } from "./toastContext";
 
type ToastAPI = {
  show: (opts: AddToastOpts) => string;
  success: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  danger: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  info: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  warning: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  promise: <T>(p: Promise<T>, opts: PromiseToastOpts<T>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};
 
export function useToast(): { toast: ToastAPI } {
  const ctx = useToastContext();
  const loadingStatus = useBurneLabel("loadingStatus");
  const toastError = useBurneLabel("toastError");
 
  const show = useCallback((opts: AddToastOpts) => ctx.add(opts), [ctx]);
 
  const byStatus = useCallback(
    (status: ToastStatus) =>
      (title: string, opts?: Omit<AddToastOpts, "status" | "title">) =>
        ctx.add({ ...opts, status, title }),
    [ctx],
  );
 
  const promise = useCallback(
    <T,>(p: Promise<T>, opts: PromiseToastOpts<T>): string => {
      const id = ctx.add({
        status: "default",
        title: opts.loading ?? loadingStatus,
        duration: 0,
        onClose: opts.onClose,
        loading: true,
        placement: opts.placement,
        classNames: opts.classNames,
        motion: opts.motion,
        motionController: opts.motionController,
        motionState: opts.motionState,
        motionPayload: opts.motionPayload,
        playInitialState: opts.playInitialState,
      });
 
      void p.then(
        (value) => {
          const successTitle =
            typeof opts.success === "function"
              ? (opts.success as (v: T) => string)(value)
              : opts.success;
          ctx.update(id, {
            status: "success",
            title: successTitle,
            loading: false,
            duration: opts.duration ?? TOAST_DEFAULT_DURATION_MS,
          });
        },
        (err: unknown) => {
          const errorTitle =
            opts.error == null
              ? toastError
              : typeof opts.error === "function"
                ? (opts.error as (e: unknown) => string)(err)
                : opts.error;
          ctx.update(id, {
            status: "danger",
            title: errorTitle,
            loading: false,
            duration: opts.duration ?? TOAST_DEFAULT_DURATION_MS,
          });
        },
      );
 
      return id;
    },
    [ctx, loadingStatus, toastError],
  );
 
  const toast: ToastAPI = {
    show,
    success: byStatus("success"),
    danger: byStatus("danger"),
    info: byStatus("info"),
    warning: byStatus("warning"),
    promise,
    dismiss: ctx.dismiss,
    dismissAll: ctx.dismissAll,
  };
 
  return { toast };
}
 