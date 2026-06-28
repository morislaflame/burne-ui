import { createContext, useContext } from "react";

import type { TextAreaSize, TextAreaStatus } from "./TextArea";

export type TextAreaFieldContextValue = {
  textareaId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  isRequired: boolean;
  status: TextAreaStatus;
  size: TextAreaSize;
};

const TextAreaFieldContext = createContext<TextAreaFieldContextValue | null>(null);

export function useTextAreaFieldContext() {
  const ctx = useContext(TextAreaFieldContext);
  if (!ctx) {
    throw new Error("TextArea compound parts must be inside <TextArea>.");
  }
  return ctx;
}

export function useOptionalTextAreaFieldContext() {
  return useContext(TextAreaFieldContext);
}

export { TextAreaFieldContext };
