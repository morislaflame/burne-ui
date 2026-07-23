import { createPortal } from "react-dom";

import { resolvePortalContainer } from "@/components/core/utils/portalContainer";

import { TOAST_LIVE_REGION_CLASS } from "./toastA11y";
import { ToastViewport } from "./toastAnimations";
import { ToastContext } from "./toastContext";
import type { ToastLiveAnnouncement, ToastProviderProps } from "./toastTypes";
import { useToastProviderState } from "./useToastProviderState";

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
}: ToastProviderProps) {
  const state = useToastProviderState({
    defaultPlacement,
    defaultVariant,
    defaultSize,
    classNames,
  });

  return (
    <ToastContext.Provider value={state.ctx}>
      {children}
      <ToastLiveRegion announcement={state.liveAnnouncement} />
      {typeof document !== "undefined" &&
        state.placements.map((placement) => {
          const portalHost = resolvePortalContainer(portalContainer);
          if (!portalHost) return null;
          return createPortal(
            <ToastViewport
              placement={placement}
              sorted={state.sortedByPlacement(placement)}
              dismissingIds={state.dismissingIds}
              onDismiss={state.dismiss}
              onRemoveFinal={state.removeFinal}
              classNames={classNames}
              defaultSize={state.defaultSize}
            />,
            portalHost,
            placement,
          );
        })}
    </ToastContext.Provider>
  );
}
