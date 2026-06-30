import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";

import type { FieldErrorProps, FieldHintProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";

export type CheckboxVariant = "default" | "secondary" | "outline" | "gloss";

export type CheckboxSize = "small" | "base" | "mid" | "large";

export type CheckboxClassNames = {
  root?: string;
  control?: string;
  controlTrack?: string;
  indicator?: string;
  content?: string;
  label?: string;
  labelText?: string;
  requiredMark?: string;
  hint?: string;
  error?: string;
  simpleLabelWrap?: string;
  simpleLabelText?: string;
  input?: string;
};

export type CheckboxRootProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange" | "onPointerDown"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    children?: ReactNode;
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    checkIcon?: ReactNode;
    danger?: boolean;
    className?: string;
    classNames?: CheckboxClassNames;
    onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  };

export type CheckboxProps = CheckboxRootProps;

export type CheckboxControlProps = HTMLAttributes<HTMLSpanElement>;

export type CheckboxIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type CheckboxContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type CheckboxLabelProps = Omit<LabelProps, "htmlFor">;

export type CheckboxHintProps = Omit<FieldHintProps, "id" | "as">;

export type CheckboxErrorProps = Omit<FieldErrorProps, "id" | "as">;

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
  labelConnected: boolean;
  accessibleName?: string;
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
    inputRef?: (node: HTMLInputElement | null) => void;
    ariaInvalid?: boolean | "false" | "true" | "grammar" | "spelling";
  };
};

export type CheckboxClassNamesProviderProps = {
  classNames?: CheckboxClassNames;
  children: ReactNode;
};

export type UseCheckboxRootStateProps = Omit<
  CheckboxRootProps,
  "children" | "className" | "classNames"
>;

export type UseCheckboxAnimationsProps = {
  isDisabled: boolean;
  enableTextMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
};
