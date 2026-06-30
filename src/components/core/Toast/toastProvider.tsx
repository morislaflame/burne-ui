import { createPortal } from "react-dom";

import { ToastContext } from "./toastContext";
import { ToastViewport } from "./toastAnimations";
import type { ToastProviderProps } from "./toastTypes";
import { useToastProviderState } from "./useToastProviderState";

export function ToastProviderRoot({
  children,
  defaultPlacement = "bottom-center",
  defaultVariant = "default",
  classNames,
}: ToastProviderProps) {
  const state = useToastProviderState({
    defaultPlacement,
    defaultVariant,
    classNames,
  });

  return (
    <ToastContext.Provider value={state.ctx}>
      {children}
      {typeof document !== "undefined" &&
        state.placements.map((placement) =>
          createPortal(
            <ToastViewport
              placement={placement}
              sorted={state.sortedByPlacement(placement)}
              dismissingIds={state.dismissingIds}
              onDismiss={state.dismiss}
              onRemoveFinal={state.removeFinal}
              classNames={classNames}
            />,
            document.body,
            placement,
          ),
        )}
    </ToastContext.Provider>
  );
}
