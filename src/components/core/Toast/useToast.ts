import { useCallback } from "react";

import { useToastContext, type AddToastOpts, type PromiseToastOpts, type ToastStatus } from "./Toast";

type ToastAPI = {
  /** Показать тост с произвольными параметрами. Возвращает ID. */
  show: (opts: AddToastOpts) => string;
  /** Удобные методы по статусу. */
  success: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  danger: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  info: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  warning: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  /** Тост с состоянием промиса: loading → success / error. */
  promise: <T>(p: Promise<T>, opts: PromiseToastOpts<T>) => string;
  /** Закрыть тост по ID. */
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
        title: opts.loading ?? "Загрузка…",
        timeout: 0,
        isLoading: true,
        placement: opts.placement,
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
            timeout: opts.timeout ?? 4000,
          });
        },
        (err: unknown) => {
          const errorTitle =
            opts.error == null
              ? "Произошла ошибка"
              : typeof opts.error === "function"
                ? (opts.error as (e: unknown) => string)(err)
                : opts.error;
          ctx.update(id, {
            status: "danger",
            title: errorTitle,
            isLoading: false,
            timeout: opts.timeout ?? 4000,
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
