import { createContext, useContext, type ChangeEvent, type InputHTMLAttributes, type RefObject } from "react";

import type { RadioSize } from "./Radio";

export type RadioFieldContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  size: RadioSize;
  mergedChecked: boolean;
  isDisabled: boolean;
  isControlled: boolean;
  isCompound: boolean;
  hasCompoundHint: boolean;
  hasCompoundError: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  useInlineCompoundMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  danger: boolean;
  inputName?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputProps: {
    value?: InputHTMLAttributes<HTMLInputElement>["value"];
    defaultChecked?: boolean;
    required?: boolean;
    form?: string;
    autoFocus?: boolean;
    tabIndex?: number;
    readOnly?: boolean;
    onBlur?: InputHTMLAttributes<HTMLInputElement>["onBlur"];
    onFocus?: InputHTMLAttributes<HTMLInputElement>["onFocus"];
  };
};

const RadioFieldContext = createContext<RadioFieldContextValue | null>(null);

export function useRadioFieldContext() {
  const ctx = useContext(RadioFieldContext);
  if (!ctx) {
    throw new Error("Radio.* должны быть внутри <Radio>.");
  }
  return ctx;
}

export function useOptionalRadioFieldContext() {
  return useContext(RadioFieldContext);
}

export { RadioFieldContext };
