import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { AlertClassNames, AlertContextValue } from "./alertTypes";

const AlertContext = createContext<AlertContextValue | null>(null);
const AlertClassNamesContext = createContext<AlertClassNames>({});

function useAlertContext() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("Alert.* components must be inside <Alert>.");
  }
  return ctx;
}

function useOptionalAlertContext() {
  return useContext(AlertContext);
}

export function AlertClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<AlertClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(AlertClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <AlertClassNamesContext.Provider value={merged}>
      {children}
    </AlertClassNamesContext.Provider>
  );
}

export function useAlertClassNames(): AlertClassNames {
  return useContext(AlertClassNamesContext);
}

export { AlertContext };

void useAlertContext;
void useOptionalAlertContext;
