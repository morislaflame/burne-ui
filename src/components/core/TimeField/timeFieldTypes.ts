import type {
  HTMLAttributes,
  MutableRefObject,
  PointerEvent,
  PointerEventHandler,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { MotionValue } from "@/components/core/utils/slotMotion";

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

export type TimeFieldPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type TimeFieldMotion = {
  shell?: TimeFieldPartMotion;
  prefix?: TimeFieldPartMotion;
  suffix?: TimeFieldPartMotion;
  segments?: TimeFieldPartMotion;
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
  classNames?: Prettify<TimeFieldClassNames>;
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
  /** Shell part motion. Root `motion.shell` still applies; this wins on the Control host. */
  motion?: Prettify<TimeFieldPartMotion>;
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
  classNames?: Prettify<TimeFieldClassNames>;
  /**
   * Per-slot motion (`shell`, `prefix`, `suffix`, `segments`).
   * Segment spinbuttons are not individual slots.
   */
  motion?: Prettify<TimeFieldMotion>;
};

export type UseTimeFieldShellAnimationsProps = {
  shellRef: RefObject<HTMLFieldSetElement | null>;
  disabled: boolean;
  variant: TimeFieldVariant;
  motion?: TimeFieldPartMotion;
  pointerInsideRef: MutableRefObject<boolean>;
  onPointerDown?: (e: PointerEvent<HTMLFieldSetElement>) => void;
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
