import { createContext, useContext } from "react";

export type FieldLabelContextValue = {
  controlId?: string;
  labelId?: string;
  isRequired?: boolean;
};

const FieldLabelContext = createContext<FieldLabelContextValue | null>(null);

function useFieldLabelContext() {
  const ctx = useContext(FieldLabelContext);
  if (!ctx) {
    throw new Error("Label must be inside a field with FieldLabelContext (Input, ComboBox, Meter, …).");
  }
  return ctx;
}

export function useOptionalFieldLabelContext() {
  return useContext(FieldLabelContext);
}

export { FieldLabelContext };

void useFieldLabelContext;
