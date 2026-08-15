import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  AlertDialogClassNames,
  AlertDialogClassNamesProviderProps,
  AlertDialogContextValue,
  AlertDialogHeaderContextValue,
} from "./alertDialogTypes";

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);
const AlertDialogClassNamesContext = createContext<AlertDialogClassNames>({});
const AlertDialogHeaderContext = createContext<AlertDialogHeaderContextValue | null>(
  null,
);

export function AlertDialogProvider({
  value,
  children,
}: {
  value: AlertDialogContextValue;
  children: ReactNode;
}) {
  return (
    <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>
  );
}

export function useAlertDialog(): AlertDialogContextValue {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) {
    throw new Error("AlertDialog.* components must be used inside <AlertDialog>.");
  }
  return ctx;
}

export function AlertDialogClassNamesProvider({
  classNames,
  children,
}: AlertDialogClassNamesProviderProps) {
  const parent = useContext(AlertDialogClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <AlertDialogClassNamesContext.Provider value={merged}>
      {children}
    </AlertDialogClassNamesContext.Provider>
  );
}

export function useAlertDialogClassNames(): AlertDialogClassNames {
  return useContext(AlertDialogClassNamesContext);
}

export function AlertDialogHeaderProvider({
  value,
  children,
}: {
  value: AlertDialogHeaderContextValue;
  children: ReactNode;
}) {
  return (
    <AlertDialogHeaderContext.Provider value={value}>
      {children}
    </AlertDialogHeaderContext.Provider>
  );
}

export function useAlertDialogHeaderContext(who: string): AlertDialogHeaderContextValue {
  const ctx = useContext(AlertDialogHeaderContext);
  if (!ctx) {
    throw new Error(`${who} must be used inside <AlertDialog.Header>.`);
  }
  return ctx;
}

export function useOptionalAlertDialogHeaderContext() {
  return useContext(AlertDialogHeaderContext);
}

/** Scope only. Defaults and host play live in `alertDialogAnimations.ts`. */
export const {
  MotionScopeProvider: AlertDialogMotionProvider,
  useMotionScope: useAlertDialogMotionScope,
  useOptionalMotionScope: useOptionalAlertDialogMotionScope,
} = createMotionScope("AlertDialog");
