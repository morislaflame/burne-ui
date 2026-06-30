import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";

import type { FieldErrorProps, FieldHintProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";

export type RadioVariant = "default" | "gloss";

export type RadioSize = "small" | "base" | "mid" | "large";

export type RadioClassNames = {
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

export type RadioRootProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange" | "onPointerDown"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    children?: ReactNode;
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    size?: RadioSize;
    variant?: RadioVariant;
    danger?: boolean;
    className?: string;
    classNames?: RadioClassNames;
    onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
  };

export type RadioProps = RadioRootProps;

export type RadioControlProps = HTMLAttributes<HTMLSpanElement>;

export type RadioIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type RadioContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type RadioLabelProps = Omit<LabelProps, "htmlFor">;

export type RadioHintProps = Omit<FieldHintProps, "id" | "as">;

export type RadioErrorProps = Omit<FieldErrorProps, "id" | "as">;

export type RadioFieldContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  size: RadioSize;
  variant: RadioVariant;
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
  onActivate?: (e: MouseEvent<HTMLInputElement>) => void;
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

export type RadioClassNamesProviderProps = {
  classNames?: RadioClassNames;
  children: ReactNode;
};

export type UseRadioRootStateProps = Omit<
  RadioRootProps,
  "children" | "className" | "classNames" | "onPointerDown" | "onClick"
>;

export type UseRadioAnimationsProps = {
  isDisabled: boolean;
  enableTextMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
};
