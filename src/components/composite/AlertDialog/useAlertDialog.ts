import { createContext, useContext } from "react";

import type { AlertDialogContextValue } from "./alertDialogTypes";

export type { AlertDialogContextValue } from "./alertDialogTypes";

export const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

/** Контекст открытого `AlertDialog`: тон, размер, `footerButtonSize` для кнопок футера. */
export function useAlertDialog(): AlertDialogContextValue {
  const ctx = useContext(AlertDialogContext);
  if (!ctx)
    throw new Error("Компоненты AlertDialog.* должны быть внутри <AlertDialog>.");
  return ctx;
}
