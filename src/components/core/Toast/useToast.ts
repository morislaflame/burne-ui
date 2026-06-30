import { useCallback } from "react";

import type { AddToastOpts, PromiseToastOpts, ToastStatus } from "./toastTypes";
import { TOAST_DEFAULT_TIMEOUT_MS } from "./toastAPI";
import { useToastContext } from "./toastContext";

type ToastAPI = {
  show: (opts: AddToastOpts) => string;
  success: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  danger: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  info: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  warning: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  promise: <T>(p: Promise<T>, opts: PromiseToastOpts<T>) => string;
  dismiss: (id: string) => void;
};

export function useToast(): { toast: ToastAPI } {
  const ctx = useToastContext();

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
        title: opts.loading ?? "Loading…",
        timeout: 0,
        isLoading: true,
        placement: opts.placement,
        classNames: opts.classNames,
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
            isLoading: false,
            timeout: opts.timeout ?? TOAST_DEFAULT_TIMEOUT_MS,
          });
        },
        (err: unknown) => {
          const errorTitle =
            opts.error == null
              ? "An error occurred"
              : typeof opts.error === "function"
                ? (opts.error as (e: unknown) => string)(err)
                : opts.error;
          ctx.update(id, {
            status: "danger",
            title: errorTitle,
            isLoading: false,
            timeout: opts.timeout ?? TOAST_DEFAULT_TIMEOUT_MS,
          });
        },
      );

      return id;
    },
    [ctx],
  );

  const toast: ToastAPI = {
    show,
    success: byStatus("success"),
    danger: byStatus("danger"),
    info: byStatus("info"),
    warning: byStatus("warning"),
    promise,
    dismiss: ctx.dismiss,
  };

  return { toast };
}
