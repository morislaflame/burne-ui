import { Children, isValidElement, type ReactNode } from "react";

/** Есть ли у root осмысленные compound-children (не только текст/пробелы). */
export function hasCompoundChildren(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => isValidElement(child));
}
