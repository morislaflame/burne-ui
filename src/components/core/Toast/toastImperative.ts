import { TOAST_DEFAULT_DURATION_MS } from "./toastAPI";
import type { AddToastOpts, PromiseToastOpts, ToastContextValue, ToastStatus } from "./toastTypes";

export type ToastImperative = {
  show: (opts: AddToastOpts) => string;
  success: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  danger: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  info: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  warning: (title: string, opts?: Omit<AddToastOpts, "status" | "title">) => string;
  promise: <T>(promise: Promise<T>, opts: PromiseToastOpts<T>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

type ToastBinding = {
  api: ToastContextValue;
  loading: string;
  error: string;
};

const stack: ToastBinding[] = [];

/** The latest mounted provider is current. Unmount removes only that provider. */
export function bindToastImperative(binding: ToastBinding): () => void {
  stack.push(binding);
  return () => {
    const index = stack.lastIndexOf(binding);
    if (index >= 0) stack.splice(index, 1);
  };
}

function apiOrWarn(): ToastBinding | null {
  const current = stack[stack.length - 1] ?? null;
  if (!current && process.env.NODE_ENV !== "production") {
    console.warn("toast() needs a mounted Toast.Provider.");
  }
  return current;
}

function show(opts: AddToastOpts): string {
  return apiOrWarn()?.api.add(opts) ?? "";
}

function byStatus(status: ToastStatus) {
  return (title: string, opts?: Omit<AddToastOpts, "status" | "title">) =>
    show({ ...opts, status, title });
}

function promiseToast<T>(promise: Promise<T>, opts: PromiseToastOpts<T>): string {
  const bound = apiOrWarn();
  if (!bound) return "";
  const id = bound.api.add({
    status: "default",
    title: opts.loading ?? bound.loading,
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
  void promise.then(
    (value) => {
      const successTitle =
        typeof opts.success === "function" ? opts.success(value) : opts.success;
      bound.api.update(id, {
        status: "success",
        title: successTitle,
        loading: false,
        duration: opts.duration ?? TOAST_DEFAULT_DURATION_MS,
      });
    },
    (err: unknown) => {
      const errorTitle =
        opts.error == null
          ? bound.error
          : typeof opts.error === "function"
            ? opts.error(err)
            : opts.error;
      bound.api.update(id, {
        status: "danger",
        title: errorTitle,
        loading: false,
        duration: opts.duration ?? TOAST_DEFAULT_DURATION_MS,
      });
    },
  );
  return id;
}

/** Imperative toast API. Works outside React once `Toast.Provider` is mounted. */
export const toast: ToastImperative = {
  show,
  success: byStatus("success"),
  danger: byStatus("danger"),
  info: byStatus("info"),
  warning: byStatus("warning"),
  promise: promiseToast,
  dismiss: (id) => stack[stack.length - 1]?.api.dismiss(id),
  dismissAll: () => stack[stack.length - 1]?.api.dismissAll(),
};
