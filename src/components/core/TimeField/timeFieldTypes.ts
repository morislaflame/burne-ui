import type {
  HTMLAttributes,
  MutableRefObject,
  PointerEvent,
  PointerEventHandler,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { FieldLabelProps } from "@/components/core/Field";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export type TimeFieldSize = ComponentSize;
 
export type TimeFieldStatus = SemanticStatus;
 
export const KIT_TIME_FIELD_VARIANTS = ["default", "outline", "secondary", "segmented"] as const;
export type KitTimeFieldVariant = (typeof KIT_TIME_FIELD_VARIANTS)[number];
export type TimeFieldVariant = KitTimeFieldVariant | (string & {});
 
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
  label?: TimeFieldPartMotion;
  hint?: TimeFieldPartMotion;
  error?: TimeFieldPartMotion;
};
 
export type TimeFieldFieldContextValue = {
  fieldId: string;
  labelId: string;
  labelConnected: boolean;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  invalid?: boolean;
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
  /**
   * Deferred handle for the Control host (`shell`, `prefix`, `suffix`, `segments`).
   * One handle → this nested scope. Simple API: pass `motionController` on `TimeField` — it is forwarded here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type TimeFieldProps = Omit<HTMLAttributes<HTMLDivElement>, "prefix" | "suffix"> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Danger visual, `aria-invalid` on the group, and `data-invalid`. `error` does the same and shows the message. */
  invalid?: boolean;
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
   * Per-slot motion (`shell`, `prefix`, `suffix`, `segments`, `label`, `hint`, `error`).
   * Chrome registers on the Root scope (siblings of Control). Control is the nested shell host.
   * Segment spinbuttons are not individual slots.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * Simple API: `motionController` is forwarded to `TimeField.Control` (shell host).
   * Compound: this handle attaches to the Root chrome scope; pass another handle on `Control`.
   */
  motion?: Prettify<MotionMapWithEvents<TimeFieldMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Simple API: forwarded to the Control nested Provider. Compound: Root chrome scope.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type UseTimeFieldShellAnimationsProps = {
  shellRef: RefObject<HTMLFieldSetElement | null>;
  disabled: boolean;
  variant: TimeFieldVariant;
  motion?: TimeFieldPartMotion;
  pointerInsideRef: MutableRefObject<boolean>;
  onPointerDown?: (e: PointerEvent<HTMLFieldSetElement>) => void;
};
 
export type TimeFieldLabelProps = Omit<FieldLabelProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & {
  motion?: Prettify<TimeFieldPartMotion>;
};
 
export type TimeFieldHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<TimeFieldPartMotion>;
};
 
export type TimeFieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<TimeFieldPartMotion>;
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
 
export type UseTimeFieldRootStateProps = Omit<TimeFieldProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState">;
 