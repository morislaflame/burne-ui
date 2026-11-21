import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
 
import {
  getTopmostOpenModalDialog,
  resolvePortalContainer,
} from "@/components/core/utils/portalContainer";
 
import { TOAST_LIVE_REGION_CLASS } from "./toastA11y";
import { ToastViewport } from "./toastAnimations";
import { ToastContext } from "./toastContext";
import type { ToastLiveAnnouncement, ToastProviderProps } from "./toastTypes";
import { useToastProviderState } from "./useToastProviderState";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { bindToastImperative } from "./toastImperative";
 
function ToastLiveRegion({ announcement }: { announcement: ToastLiveAnnouncement }) {
  const polite = announcement.assertive ? "" : announcement.text;
  const assertive = announcement.assertive ? announcement.text : "";
 
  return (
    <>
      <div
        className={TOAST_LIVE_REGION_CLASS}
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
      >
        {polite}
      </div>
      <div
        className={TOAST_LIVE_REGION_CLASS}
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions text"
      >
        {assertive}
      </div>
    </>
  );
}
 
export function ToastProviderRoot({
  children,
  defaultPlacement = "bottom-center",
  defaultVariant = "default",
  defaultSize = "base",
  portalContainer,
  classNames,
  motion,
}: ToastProviderProps) {
  const state = useToastProviderState({
    defaultPlacement,
    defaultVariant,
    defaultSize,
    classNames,
  });
  const loadingStatus = useBurneLabel("loadingStatus");
  const toastError = useBurneLabel("toastError");

  useEffect(() => {
    return bindToastImperative({
      api: state.ctx,
      loading: loadingStatus,
      error: toastError,
    });
  }, [loadingStatus, state.ctx, toastError]);

  const hasToasts = state.toasts.length > 0;
  const [topModalDialog, setTopModalDialog] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (portalContainer || !hasToasts || typeof document === "undefined") {
      setTopModalDialog(null);
      return undefined;
    }
    const sync = () => {
      const next = getTopmostOpenModalDialog();
      setTopModalDialog((prev) => (prev === next ? prev : next));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open", "class"],
    });
    return () => observer.disconnect();
  }, [hasToasts, portalContainer]);

  const activeModalDialog =
    !portalContainer && hasToasts
      ? (topModalDialog && topModalDialog.isConnected && topModalDialog.open
          ? topModalDialog
          : getTopmostOpenModalDialog())
      : null;
 
  return (
    <ToastContext.Provider value={state.ctx}>
      {children}
      <ToastLiveRegion announcement={state.liveAnnouncement} />
      {typeof document !== "undefined" &&
        state.placements.map((placement) => {
          const portalHost = portalContainer
            ? resolvePortalContainer(portalContainer)
            : (activeModalDialog ?? resolvePortalContainer(null));
          if (!portalHost) return null;
          return createPortal(
            <ToastViewport
              placement={placement}
              sorted={state.sortedByPlacement(placement)}
              dismissingIds={state.dismissingIds}
              onDismiss={state.dismiss}
              onRemoveFinal={state.removeFinal}
              classNames={classNames}
              motion={motion}
              defaultSize={state.defaultSize}
            />,
            portalHost,
            placement,
          );
        })}
    </ToastContext.Provider>
  );
}
 