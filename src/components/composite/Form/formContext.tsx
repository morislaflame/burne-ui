import { createContext, useContext, type ReactNode } from "react";

import type { FormBindingContextValue, FormClassNames, FormShellIds } from "./formTypes";

const FormClassNamesContext = createContext<FormClassNames>({});
const FormShellContext = createContext<FormShellIds | null>(null);
const FormBindingContext = createContext<FormBindingContextValue | null>(null);

export function FormClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: FormClassNames;
  children: ReactNode;
}) {
  const parent = useContext(FormClassNamesContext);
  const merged = { ...parent, ...classNames };
  return (
    <FormClassNamesContext.Provider value={merged}>{children}</FormClassNamesContext.Provider>
  );
}

export function FormShellProvider({
  shellIds,
  children,
}: {
  shellIds: FormShellIds;
  children: ReactNode;
}) {
  return <FormShellContext.Provider value={shellIds}>{children}</FormShellContext.Provider>;
}

export function useFormClassNames(): FormClassNames {
  return useContext(FormClassNamesContext);
}

export function useFormShellIds(): FormShellIds | null {
  return useContext(FormShellContext);
}

export function useOptionalFormBindingContext() {
  return useContext(FormBindingContext);
}

export function useFormBindingContext() {
  const ctx = useContext(FormBindingContext);
  if (!ctx) {
    throw new Error("useFormBindingContext must be used within <Form>.");
  }
  return ctx;
}

export { FormBindingContext };
