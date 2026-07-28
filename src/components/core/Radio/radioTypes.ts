import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  LabelHTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { FieldErrorProps, FieldHintProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";
import type { SelectionIndicatorClassNames } from "@/components/core/SelectionIndicator";

export type RadioVariant = "default" | "secondary" | "outline" | "gloss";

export type RadioSize = "small" | "base" | "mid" | "large";

export type RadioClassNames = {
  root?: string;
  control?: string;
  controlTrack?: string;
  indicator?: string;
  indicatorFill?: string;
  indicatorMark?: string;
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

export type RadioProps = Omit<
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
    classNames?: Prettify<RadioClassNames>;
    onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
  };


export type RadioControlProps = HTMLAttributes<HTMLSpanElement>;

export type RadioIndicatorClassNames = SelectionIndicatorClassNames &
  Partial<Pick<RadioClassNames, "indicator" | "indicatorFill" | "indicatorMark">>;

export type RadioIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  size?: RadioSize;
  classNames?: Prettify<RadioIndicatorClassNames>;
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
  /** Visible label present (simple `label` or compound `Radio.Label`) — skips fallback `aria-label`. */
  hasLabel: boolean;
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
  classNames?: Prettify<RadioClassNames>;
  children: ReactNode;
};

export type UseRadioRootStateProps = Omit<
  RadioProps,
  "children" | "className" | "classNames" | "onPointerDown" | "onClick"
>;

export type UseRadioAnimationsProps = {
  isDisabled: boolean;
  enableTextMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLLabelElement>) => void;
};
