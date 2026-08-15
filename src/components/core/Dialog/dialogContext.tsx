import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  DialogClassNames,
  DialogClassNamesProviderProps,
  DialogContextValue,
} from "./dialogTypes";

const DialogContext = createContext<DialogContextValue | null>(null);
const DialogClassNamesContext = createContext<DialogClassNames>({});

export function DialogProvider({
  value,
  children,
}: {
  value: DialogContextValue;
  children: React.ReactNode;
}) {
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export function DialogClassNamesProvider({
  classNames,
  children,
}: DialogClassNamesProviderProps) {
  const parent = useContext(DialogClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <DialogClassNamesContext.Provider value={merged}>
      {children}
    </DialogClassNamesContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog.* components must be used inside <Dialog>.");
  }
  return ctx;
}

export function useDialogClassNames(): DialogClassNames {
  return useContext(DialogClassNamesContext);
}

/** Scope only. Defaults and host play live in `dialogAnimations.ts`. */
export const {
  MotionScopeProvider: DialogMotionProvider,
  useMotionScope: useDialogMotionScope,
  useOptionalMotionScope: useOptionalDialogMotionScope,
} = createMotionScope("Dialog");