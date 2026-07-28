import { createContext, useContext, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { FormBindingContextValue, FormClassNames, FormShellValue, FormSize } from "./formTypes";

const FormClassNamesContext = createContext<FormClassNames>({});
const FormShellContext = createContext<FormShellValue | null>(null);
const FormBindingContext = createContext<FormBindingContextValue | null>(null);

export function FormClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<FormClassNames>;
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
  size = "base",
  children,
}: {
  shellIds: FormShellValue["shellIds"];
  size?: FormSize;
  children: ReactNode;
}) {
  const value: FormShellValue = { shellIds, size };
  return <FormShellContext.Provider value={value}>{children}</FormShellContext.Provider>;
}

export function useFormClassNames(): FormClassNames {
  return useContext(FormClassNamesContext);
}

export function useFormShell(): FormShellValue | null {
  return useContext(FormShellContext);
}

export function useFormShellIds() {
  return useContext(FormShellContext)?.shellIds ?? null;
}

export function useFormSize(): FormSize {
  return useContext(FormShellContext)?.size ?? "base";
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
