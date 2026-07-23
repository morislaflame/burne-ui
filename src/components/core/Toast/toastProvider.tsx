import { createPortal } from "react-dom";

import { resolvePortalContainer } from "@/components/core/utils/portalContainer";

import { ToastContext } from "./toastContext";
import { ToastViewport } from "./toastAnimations";
import type { ToastProviderProps } from "./toastTypes";
import { useToastProviderState } from "./useToastProviderState";

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
