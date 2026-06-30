import { createContext, useContext } from "react";

import type {
  AlertDialogContextValue,
  AlertDialogHeaderContextValue,
} from "./alertDialogTypes";

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

const AlertDialogHeaderContext = createContext<AlertDialogHeaderContextValue | null>(
  null,
);

export function AlertDialogProvider({
  value,
  children,
}: {
  value: AlertDialogContextValue;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>
  );
}

export function AlertDialogHeaderProvider({
  value,
  children,
}: {
  value: AlertDialogHeaderContextValue;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogHeaderContext.Provider value={value}>
      {children}
    </AlertDialogHeaderContext.Provider>
  );
}

export function useAlertDialog(): AlertDialogContextValue {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) {
    throw new Error("Компоненты AlertDialog.* должны быть внутри <AlertDialog>.");
  }
  return ctx;
}

export function useAlertDialogHeaderContext(who: string): AlertDialogHeaderContextValue {
  const ctx = useContext(AlertDialogHeaderContext);
  if (!ctx) {
    throw new Error(`${who} должен быть внутри <AlertDialog.Header>.`);
  }
  return ctx;
}

export function useOptionalAlertDialogHeaderContext() {
  return useContext(AlertDialogHeaderContext);
}
