import { createContext, useContext } from "react";

export type FieldLabelContextValue = {
  /** `htmlFor` для `<label>` — id контрола поля. */
  controlId?: string;
  /** `id` для `<span>` — подпись для `aria-labelledby`. */
  labelId?: string;
  isRequired?: boolean;
};

const FieldLabelContext = createContext<FieldLabelContextValue | null>(null);

export function useFieldLabelContext() {
  const ctx = useContext(FieldLabelContext);
  if (!ctx) {
    throw new Error("Label должен быть внутри поля с FieldLabelContext (Input, Selector, Meter, …).");
  }
  return ctx;
}

export function useOptionalFieldLabelContext() {
  return useContext(FieldLabelContext);
}

export { FieldLabelContext };
