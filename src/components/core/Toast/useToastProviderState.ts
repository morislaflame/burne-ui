import { useCallback, useMemo, useRef, useState } from "react";

import {
  createToastId,
  TOAST_DEFAULT_TIMEOUT_MS,
} from "./toastAPI";
import type { AddToastOpts, ToastContextValue, ToastEntry, ToastPlacement } from "./toastTypes";

export function useToastProviderState({
  defaultPlacement = "bottom-center",
  defaultVariant = "default",
  classNames: providerClassNames,
}: {
  defaultPlacement?: ToastPlacement;
  defaultVariant?: "default" | "gloss";
  classNames?: AddToastOpts["classNames"];
}) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());
  const orderRef = useRef(0);

  const add = useCallback(
    (opts: AddToastOpts): string => {
      const id = opts.id ?? createToastId();
      const entry: ToastEntry = {
        id,
        status: opts.status ?? "default",
        variant: opts.variant ?? defaultVariant,
        title: opts.title,
        description: opts.description,
        action: opts.action,
        timeout: opts.timeout ?? TOAST_DEFAULT_TIMEOUT_MS,
        placement: opts.placement ?? defaultPlacement,
        createdAt: ++orderRef.current,
        isLoading: opts.isLoading ?? false,
        classNames: { ...providerClassNames, ...opts.classNames },
      };
      setToasts((prev) => [...prev, entry]);
      return id;
    },
    [defaultPlacement, defaultVariant, providerClassNames],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<ToastEntry, "id" | "createdAt">>) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setDismissingIds((prev) => new Set([...prev, id]));
  }, []);

  const removeFinal = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    setDismissingIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }, []);

  const placements = useMemo(
    () => [...new Set(toasts.map((t) => t.placement))] as ToastPlacement[],
    [toasts],
  );

  const ctx: ToastContextValue = useMemo(
    () => ({ add, update, dismiss }),
    [add, dismiss, update],
  );

  const sortedByPlacement = useCallback(
    (placement: ToastPlacement) =>
      toasts
        .filter((t) => t.placement === placement)
        .toSorted((a, b) => b.createdAt - a.createdAt),
    [toasts],
  );

  return {
    toasts,
    dismissingIds,
    placements,
    ctx,
    sortedByPlacement,
    dismiss,
    removeFinal,
    providerClassNames,
  };
}
