import { createContext, useContext } from "react";

import type { AlertDialogHeaderContextValue } from "./alertDialogTypes";

const AlertDialogHeaderContext = createContext<AlertDialogHeaderContextValue | null>(
  null,
);

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
