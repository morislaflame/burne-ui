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
import type { SelectionIndicatorClassNames } from "@/components/core/SelectionIndicator";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

export type CheckboxVariant = "default" | "secondary" | "outline" | "gloss";

export type CheckboxSize = "small" | "base" | "mid" | "large";

export type CheckboxClassNames = {
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

export type CheckboxProps = Omit<
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
    status?: SemanticStatus;
    icon?: ReactNode;
    className?: string;
    classNames?: CheckboxClassNames;
    onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  };


export type CheckboxControlProps = HTMLAttributes<HTMLSpanElement>;

export type CheckboxIndicatorClassNames = SelectionIndicatorClassNames &
  Partial<Pick<CheckboxClassNames, "indicator" | "indicatorFill" | "indicatorMark">>;

export type CheckboxIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  size?: CheckboxSize;
  classNames?: CheckboxIndicatorClassNames;
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
  status: SemanticStatus;
  icon?: ReactNode;
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
  CheckboxProps,
  "children" | "className" | "classNames"
>;

export type UseCheckboxAnimationsProps = {
  isDisabled: boolean;
  enableTextMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
};
