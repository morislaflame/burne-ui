import { useCallback, useMemo, useRef, useState } from "react";

import { createToastId, TOAST_DEFAULT_TIMEOUT_MS } from "./toastAPI";
import { resolveToastLiveRole, toastAnnouncementText } from "./toastA11y";
import type {
  AddToastOpts,
  ToastContextValue,
  ToastEntry,
  ToastLiveAnnouncement,
  ToastPlacement,
} from "./toastTypes";

export function useToastProviderState({
  defaultPlacement = "bottom-center",
  defaultVariant = "default",
  defaultSize = "base",
  classNames: providerClassNames,
}: {
  defaultPlacement?: ToastPlacement;
  defaultVariant?: "default" | "gloss";
  defaultSize?: AddToastOpts["size"];
  classNames?: AddToastOpts["classNames"];
}) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());
  const [liveAnnouncement, setLiveAnnouncement] = useState<ToastLiveAnnouncement>({
    text: "",
    assertive: false,
    nonce: 0,
  });
  const orderRef = useRef(0);
  const announceNonceRef = useRef(0);
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  const announce = useCallback((entry: ToastEntry) => {
    const text = toastAnnouncementText(entry.title, entry.description);
    if (!text) return;
    const assertive = resolveToastLiveRole(entry.status) === "alert";
    // Clear first so identical messages still get announced by SRs.
    setLiveAnnouncement({ text: "", assertive, nonce: ++announceNonceRef.current });
    requestAnimationFrame(() => {
      setLiveAnnouncement({
        text,
        assertive,
        nonce: ++announceNonceRef.current,
      });
    });
  }, []);

  const add = useCallback(
    (opts: AddToastOpts): string => {
      const id = opts.id ?? createToastId();
      const entry: ToastEntry = {
        id,
        status: opts.status ?? "default",
        variant: opts.variant ?? defaultVariant,
        size: opts.size ?? defaultSize,
        title: opts.title,
        description: opts.description,
        action: opts.action,
        timeout: opts.timeout ?? TOAST_DEFAULT_TIMEOUT_MS,
        placement: opts.placement ?? defaultPlacement,
        createdAt: ++orderRef.current,
        loading: opts.loading ?? false,
        classNames: { ...providerClassNames, ...opts.classNames },
        motion: opts.motion,
      };
      setToasts((prev) => [...prev, entry]);
      announce(entry);
      return id;
    },
    [announce, defaultPlacement, defaultSize, defaultVariant, providerClassNames],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<ToastEntry, "id" | "createdAt">>) => {
      const current = toastsRef.current.find((t) => t.id === id);
      if (!current) return;
      const updated: ToastEntry = { ...current, ...patch };
      setToasts((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (
        patch.title !== undefined ||
        patch.description !== undefined ||
        patch.status !== undefined ||
        patch.loading === false
      ) {
        announce(updated);
      }
    },
    [announce],
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
    defaultSize,
    liveAnnouncement,
  };
}
