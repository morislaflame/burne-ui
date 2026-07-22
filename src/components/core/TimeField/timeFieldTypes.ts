import type {
  HTMLAttributes,
  PointerEventHandler,
  ReactNode,
} from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

export type TimeFieldSize = ComponentSize;

export type TimeFieldStatus = SemanticStatus;

export type TimeFieldVariant = "default" | "outline" | "secondary" | "segmented" | "gloss";

export type TimeFieldFormat = "HH:mm" | "HH:mm:ss";

export type TimeFieldSegId = "h" | "m" | "s";

export type TimeFieldHMS = { h: number; m: number; s: number };

export type TimeFieldClassNames = {
  root?: string;
  label?: string;
  shell?: string;
  shellInner?: string;
  prefix?: string;
  suffix?: string;
  segments?: string;
  segmentGroup?: string;
  segment?: string;
  segmentSeparator?: string;
  keyboardInput?: string;
  hint?: string;
  error?: string;
};

export type TimeFieldFieldContextValue = {
  fieldId: string;
  labelId: string;
  labelConnected: boolean;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  required: boolean;
  status: TimeFieldStatus;
  size: TimeFieldSize;
  variant: TimeFieldVariant;
  compact: boolean;
};

export type TimeFieldClassNamesProviderProps = {
  classNames?: TimeFieldClassNames;
  children: ReactNode;
};

export type TimeFieldControlProps = Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  "onChange" | "prefix" | "suffix"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  format?: TimeFieldFormat;
  disabled?: boolean;
  size?: TimeFieldSize;
  status?: TimeFieldStatus;
  variant?: TimeFieldVariant;
  compact?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Separator between hour/minute/second segments. Default: `":"`. */
  segmentSeparator?: ReactNode;
  onPointerDown?: PointerEventHandler<HTMLFieldSetElement>;
};

export type TimeFieldProps = Omit<HTMLAttributes<HTMLDivElement>, "prefix" | "suffix"> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  required?: boolean;
  status?: TimeFieldStatus;
  size?: TimeFieldSize;
  variant?: TimeFieldVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  format?: TimeFieldFormat;
  disabled?: boolean;
  compact?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Separator between hour/minute/second segments. Default: `":"`. */
  segmentSeparator?: ReactNode;
  classNames?: TimeFieldClassNames;
};

export type TimeFieldHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type TimeFieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type TimeFieldSimpleBodyProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  labelId: string;
  controlProps: Omit<
    TimeFieldControlProps,
    "id" | "size" | "status" | "variant" | "compact" | "prefix" | "suffix"
  > & {
    id: string;
    size: TimeFieldSize;
    status: TimeFieldStatus;
    variant: TimeFieldVariant;
    compact: boolean;
    prefix?: ReactNode;
    suffix?: ReactNode;
  };
};

export type UseTimeFieldRootStateProps = TimeFieldProps;
