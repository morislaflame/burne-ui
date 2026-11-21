import { useCallback, useEffect, useMemo, useRef, useState } from "react";
 
import { createToastId, TOAST_DEFAULT_DURATION_MS } from "./toastAPI";
import { resolveToastLiveRole, toastAnnouncementText } from "./toastA11y";
import type {
  AddToastOpts,
  ToastContextValue,
  ToastEntry,
  ToastLiveAnnouncement,
  ToastPlacement,
  ToastVariant,
} from "./toastTypes";
 
export function useToastProviderState({
  defaultPlacement = "bottom-center",
  defaultVariant = "default",
  defaultSize = "base",
  classNames: providerClassNames,
}: {
  defaultPlacement?: ToastPlacement;
  defaultVariant?: ToastVariant;
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
  const announceRafRef = useRef<number | null>(null);
  const toastsRef = useRef(toasts);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  toastsRef.current = toasts;

  useEffect(() => {
    return () => {
      if (announceRafRef.current != null) {
        cancelAnimationFrame(announceRafRef.current);
        announceRafRef.current = null;
      }
    };
  }, []);
 
  const announce = useCallback((entry: ToastEntry) => {
    const text = toastAnnouncementText(entry.title, entry.description);
    if (!text) return;
    const assertive = resolveToastLiveRole(entry.status) === "alert";
    if (announceRafRef.current != null) {
      cancelAnimationFrame(announceRafRef.current);
      announceRafRef.current = null;
    }
    // Clear first so identical messages still get announced by SRs.
    setLiveAnnouncement({ text: "", assertive, nonce: ++announceNonceRef.current });
    announceRafRef.current = requestAnimationFrame(() => {
      announceRafRef.current = null;
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
      const existing = opts.id != null
        ? toastsRef.current.find((t) => t.id === id)
        : undefined;

      if (existing) {
        const updated: ToastEntry = {
          ...existing,
          status: opts.status ?? existing.status,
          variant: opts.variant ?? existing.variant,
          size: opts.size ?? existing.size,
          title: opts.title !== undefined ? opts.title : existing.title,
          description:
            opts.description !== undefined ? opts.description : existing.description,
          action: opts.action !== undefined ? opts.action : existing.action,
          duration: opts.duration ?? existing.duration,
          onClose: opts.onClose ?? existing.onClose,
          placement: opts.placement ?? existing.placement,
          loading: opts.loading ?? false,
          classNames: opts.classNames
            ? { ...providerClassNames, ...opts.classNames }
            : existing.classNames,
          motion: opts.motion ?? existing.motion,
          motionController: opts.motionController ?? existing.motionController,
          motionState: opts.motionState ?? existing.motionState,
          motionPayload: opts.motionPayload ?? existing.motionPayload,
          playInitialState: opts.playInitialState ?? existing.playInitialState,
        };
        const nextList = toastsRef.current.map((t) => (t.id === id ? updated : t));
        toastsRef.current = nextList;
        setToasts(nextList);
        setDismissingIds((prev) => {
          if (!prev.has(id)) return prev;
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
        announce(updated);
        return id;
      }

      const entry: ToastEntry = {
        id,
        status: opts.status ?? "default",
        variant: opts.variant ?? defaultVariant,
        size: opts.size ?? defaultSize,
        title: opts.title,
        description: opts.description,
        action: opts.action,
        duration: opts.duration ?? TOAST_DEFAULT_DURATION_MS,
        onClose: opts.onClose,
        placement: opts.placement ?? defaultPlacement,
        createdAt: ++orderRef.current,
        loading: opts.loading ?? false,
        classNames: { ...providerClassNames, ...opts.classNames },
        motion: opts.motion,
        motionController: opts.motionController,
        motionState: opts.motionState,
        motionPayload: opts.motionPayload,
        playInitialState: opts.playInitialState,
      };
      const nextList = [...toastsRef.current, entry];
      toastsRef.current = nextList;
      setToasts(nextList);
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
      const nextList = toastsRef.current.map((t) => (t.id === id ? updated : t));
      toastsRef.current = nextList;
      setToasts(nextList);
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

  const dismissAll = useCallback(() => {
    const ids = toastsRef.current.map((toast) => toast.id);
    if (ids.length === 0) return;
    setDismissingIds((prev) => new Set([...prev, ...ids]));
  }, []);
 
  const removeFinal = useCallback((id: string) => {
    const removed = toastsRef.current.find((t) => t.id === id);
    const nextList = toastsRef.current.filter((t) => t.id !== id);
    toastsRef.current = nextList;
    setToasts(nextList);
    setDismissingIds((prev) => {
      if (!prev.has(id)) return prev;
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    removed?.onClose?.();
  }, []);
 
  const placements = useMemo(
    () => [...new Set(toasts.map((t) => t.placement))] as ToastPlacement[],
    [toasts],
  );
 
  const ctx: ToastContextValue = useMemo(
    () => ({ add, update, dismiss, dismissAll }),
    [add, dismiss, dismissAll, update],
  );
 
  const sortedByPlacement = useCallback(
    (placement: ToastPlacement) =>
      [...toasts.filter((t) => t.placement === placement)].sort(
        (a, b) => b.createdAt - a.createdAt,
      ),
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
 