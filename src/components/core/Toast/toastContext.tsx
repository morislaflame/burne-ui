import { createContext, useContext, useMemo } from "react";

import type {
  ToastClassNames,
  ToastClassNamesProviderProps,
  ToastContextValue,
  ToastItemContextValue,
} from "./toastTypes";

const ToastContext = createContext<ToastContextValue | null>(null);
const ToastItemContext = createContext<ToastItemContextValue | null>(null);
const ToastClassNamesContext = createContext<ToastClassNames>({});

export function ToastClassNamesProvider({
  classNames,
  children,
}: ToastClassNamesProviderProps) {
  const parent = useContext(ToastClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ToastClassNamesContext.Provider value={merged}>
      {children}
    </ToastClassNamesContext.Provider>
  );
}

export function ToastItemProvider({
  value,
  children,
}: {
  value: ToastItemContextValue;
  children: React.ReactNode;
}) {
  return (
    <ToastItemContext.Provider value={value}>{children}</ToastItemContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("Components Toast must be used inside <Toast.Provider>.");
  return ctx;
}

export function useToastItem(): ToastItemContextValue {
  const ctx = useContext(ToastItemContext);
  if (!ctx) throw new Error("Toast.* must be inside <Toast>.");
  return ctx;
}

export function useToastClassNames(): ToastClassNames {
  return useContext(ToastClassNamesContext);
}

export { ToastContext, ToastItemContext };
