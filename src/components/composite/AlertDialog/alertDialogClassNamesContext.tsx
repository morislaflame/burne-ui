import { createContext, useContext, useMemo } from "react";

import type { AlertDialogClassNames, AlertDialogClassNamesProviderProps } from "./alertDialogTypes";

const AlertDialogClassNamesContext = createContext<AlertDialogClassNames>({});

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
