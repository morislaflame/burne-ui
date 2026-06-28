import { createContext, useContext } from "react";

import type { ReactNode } from "react";

import type { AddToastOpts, ToastPlacement, ToastStatus } from "./Toast";

export type ToastContextValue = {
  add: (opts: AddToastOpts) => string;
  update: (
    id: string,
    patch: Partial<{
      status?: ToastStatus;
      title?: ReactNode;
      description?: ReactNode;
      action?: ReactNode;
      timeout?: number;
      placement?: ToastPlacement;
      isLoading?: boolean;
    }>,
  ) => void;
  dismiss: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("Components Toast must be used inside <Toast.Provider>.");
  return ctx;
}
