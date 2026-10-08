import type { HTMLAttributes, RefObject, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import type { LabelProps } from "@/components/core/Label";
import type { ListBoxProps } from "@/components/core/ListBox";
import type { PopoverSide } from "@/components/core/Popover";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
 
export type SelectOption = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};
 
export type SelectClassNames = {
  root?: string;
  label?: string;
  triggerGroup?: string;
  value?: string;
  trigger?: string;
  triggerIcon?: string;
  triggerIconWrap?: string;
  popover?: string;
  popoverBody?: string;
  listBox?: string;
  listBoxItem?: string;
  listBoxLabel?: string;
  listBoxHint?: string;
  listBoxIcon?: string;
  listBoxEmpty?: string;
  listBoxHeader?: string;
  listBoxHeaderText?: string;
  hint?: string;
  error?: string;
};
 
export type SelectPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type SelectMotion = {
  triggerGroup?: SelectPartMotion;
  value?: SelectPartMotion;
  trigger?: SelectPartMotion;
  triggerIcon?: SelectPartMotion;
  label?: SelectPartMotion;
  hint?: SelectPartMotion;
  error?: SelectPartMotion;
};
 
export type SelectProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Danger visual, `aria-invalid`, and `data-invalid`. `error` does the same and shows the message. */
  invalid?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  status?: InputStatus;
  size?: InputSize;
  options?: SelectOption[];
  /** Several values. The menu stays open; each choice toggles. */
  multiple?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Controlled selection when `multiple`. */
  values?: string[];
  /** Uncontrolled selection when `multiple`. */
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: InputVariant;
  disabled?: boolean;
  placeholder?: string;
  menuMaxHeight?: string;
  /** Mount only the visible options. Flat `options` list. */
  virtualized?: boolean;
  /** Fixed option height in px. Measured from the first row when omitted. */
  virtualItemSize?: number;
  classNames?: Prettify<SelectClassNames>;
  /**
   * Per-slot motion (`triggerGroup`, `value`, `trigger`, `triggerIcon`, `label`, `hint`, `error`).
   * Menu enter lives on Popover — not duplicated here.
   * Chrome registers on the Root scope (siblings of TriggerGroup). TriggerGroup is the nested shell host.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * Simple API: `motionController` is forwarded to `Select.TriggerGroup` (shell host).
   * Compound: this handle attaches to the Root chrome scope; pass another handle on `TriggerGroup`.
   */
  motion?: Prettify<MotionMapWithEvents<SelectMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Simple API: forwarded to the TriggerGroup nested Provider. Compound: Root chrome scope.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type SelectSimpleProps = SelectProps & {
  options: SelectOption[];
};
 
export type SelectFieldContextValue = {
  selectId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  labelConnected: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  invalid?: boolean;
  formInvalid?: boolean;
  required: boolean;
  status: InputStatus;
  size: InputSize;
  errorMessage?: ReactNode;
};
 
export type SelectContextValue = SelectFieldContextValue & {
  open: boolean;
  setOpen: (open: boolean) => void;
  multiple: boolean;
  value: string;
  setValue: (value: string) => void;
  values: string[];
  setValues: (values: string[]) => void;
  listId: string;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  valueRef: React.RefObject<HTMLButtonElement | null>;
  variant: InputVariant;
  disabled: boolean;
  placeholder: string;
  menuMaxHeight: string;
  virtualized: boolean;
  virtualItemSize?: number;
  options: SelectOption[];
  optionValues: string[];
  formValueRef?: (node: HTMLButtonElement | null) => void;
  formOnBlur?: () => void;
};
 
export type SelectClassNamesProviderProps = {
  classNames?: Prettify<SelectClassNames>;
  children: ReactNode;
};
 
export type SelectTriggerGroupProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
  /** Part motion for the `triggerGroup` host slot. Root `motion.triggerGroup` still applies. */
  motion?: Prettify<SelectPartMotion>;
  /**
   * Deferred handle for the TriggerGroup host (`triggerGroup`, `value`, `trigger`, `triggerIcon`).
   * One handle → this nested scope. Simple API: pass `motionController` on `Select` — it is forwarded here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type SelectValueProps = HTMLAttributes<HTMLButtonElement> & {
  placeholder?: string;
  motion?: Prettify<SelectPartMotion>;
};
 
export type SelectTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  motion?: Prettify<SelectPartMotion>;
};
 
export type UseSelectShellAnimationsProps = {
  shellRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
  variant: InputVariant;
  groupSegment: unknown;
  motion?: SelectPartMotion;
  pointerInsideRef: RefObject<boolean>;
};
 
export type SelectPopoverProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** Preferred side relative to the trigger. Default: `bottom`. */
  side?: PopoverSide;
  /** Panel alignment relative to the trigger. Default: `start` when matching width. */
  align?: FloatingAlign;
  offset?: number;
  /** Props forwarded to the inner `ListBox` (controlled selection props are owned by Select). */
  listBoxProps?: Omit<
    ListBoxProps,
    | "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "activeValue"
    | "onActiveValueChange"
    | "listId"
    | "multiple"
  >;
};
 
export type SelectLabelProps = Omit<LabelProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & {
  motion?: Prettify<SelectPartMotion>;
};
 
export type SelectHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: InputStatus;
  motion?: Prettify<SelectPartMotion>;
};
 
export type SelectErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<SelectPartMotion>;
};
 
export type UseSelectRootStateProps = SelectProps;
 