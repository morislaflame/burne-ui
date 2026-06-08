import {
  createContext,
  useContext,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";

/** Внешний вид обода кружка в состоянии «не отмечено». */
export type CheckboxVariant = "default" | "secondary" | "outline";

export type CheckboxSize = "small" | "base" | "mid" | "large";

export type CheckboxFieldContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  size: CheckboxSize;
  variant: CheckboxVariant;
  mergedChecked: boolean;
  isDisabled: boolean;
  isControlled: boolean;
  isCompound: boolean;
  hasCompoundHint: boolean;
  hasCompoundError: boolean;
  useInlineCompoundMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  hintConnected: boolean;
  errorConnected: boolean;
  danger: boolean;
  checkIcon?: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputProps: {
    name?: string;
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

const CheckboxFieldContext = createContext<CheckboxFieldContextValue | null>(null);

export function useCheckboxFieldContext() {
  const ctx = useContext(CheckboxFieldContext);
  if (!ctx) {
    throw new Error("Checkbox.* должны быть внутри <Checkbox>.");
  }
  return ctx;
}

function useOptionalCheckboxFieldContext() {
  return useContext(CheckboxFieldContext);
}

export { CheckboxFieldContext };

void useOptionalCheckboxFieldContext;
