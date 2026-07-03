import { createContext, useContext } from "react";

import type { AlertDialogContextValue } from "./alertDialogTypes";

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

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

export function useAlertDialog(): AlertDialogContextValue {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) {
    throw new Error("AlertDialog.* components must be used inside <AlertDialog>.");
  }
  return ctx;
}
