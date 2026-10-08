import type { HTMLAttributes, InputHTMLAttributes, MutableRefObject, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import type { LabelProps } from "@/components/core/Label";
import type { ListBoxProps } from "@/components/core/ListBox";
import type { PopoverSide } from "@/components/core/Popover";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
 
export type ComboBoxOption = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  filterText?: string;
};
 
export type ComboBoxClassNames = {
  root?: string;
  label?: string;
  inputGroup?: string;
  input?: string;
  trigger?: string;
  triggerIcon?: string;
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
 
export type ComboBoxPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type ComboBoxMotion = {
  inputGroup?: ComboBoxPartMotion;
  input?: ComboBoxPartMotion;
  trigger?: ComboBoxPartMotion;
  triggerIcon?: ComboBoxPartMotion;
  label?: ComboBoxPartMotion;
  hint?: ComboBoxPartMotion;
  error?: ComboBoxPartMotion;
};
 
export type ComboBoxProps = HTMLAttributes<HTMLDivElement> & {
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
  options?: ComboBoxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
  classNames?: Prettify<ComboBoxClassNames>;
  /**
   * Per-slot motion (`inputGroup`, `input`, `trigger`, `triggerIcon`, `label`, `hint`, `error`).
   * Menu enter lives on Popover — not duplicated here.
   * Chrome registers on the Root scope (siblings of InputGroup). InputGroup is the nested shell host.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * Simple API: `motionController` is forwarded to `ComboBox.InputGroup` (shell host).
   * Compound: this handle attaches to the Root chrome scope; pass another handle on `InputGroup`.
   */
  motion?: Prettify<MotionMapWithEvents<ComboBoxMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Simple API: forwarded to the InputGroup nested Provider. Compound: Root chrome scope.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type ComboBoxSimpleProps = ComboBoxProps & {
  options: ComboBoxOption[];
};
 
export type ComboBoxFieldContextValue = {
  comboBoxId: string;
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
 
export type ComboBoxContextValue = ComboBoxFieldContextValue & {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
  listId: string;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  variant: InputVariant;
  disabled: boolean;
  placeholder: string;
  menuMaxHeight: string;
  virtualized: boolean;
  virtualItemSize?: number;
  options: ComboBoxOption[];
  filteredValues: string[];
  formInputRef?: (node: HTMLInputElement | null) => void;
  formOnBlur?: () => void;
};
 
export type ComboBoxClassNamesProviderProps = {
  classNames?: Prettify<ComboBoxClassNames>;
  children: ReactNode;
};
 
export type ComboBoxInputGroupProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
  /** Part motion for the `inputGroup` host slot. Root `motion.inputGroup` still applies. */
  motion?: Prettify<ComboBoxPartMotion>;
  /**
   * Deferred handle for the InputGroup host (`inputGroup`, `input`, `trigger`, `triggerIcon`).
   * One handle → this nested scope. Simple API: pass `motionController` on `ComboBox` — it is forwarded here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type ComboBoxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "size"
> & {
  motion?: Prettify<ComboBoxPartMotion>;
};
 
export type ComboBoxTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  motion?: Prettify<ComboBoxPartMotion>;
};
 
export type UseComboBoxShellAnimationsProps = {
  shellRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
  variant: InputVariant;
  groupSegment: unknown;
  motion?: ComboBoxPartMotion;
  pointerInsideRef: MutableRefObject<boolean>;
};
 
export type ComboBoxPopoverProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** Preferred side relative to the trigger. Default: `bottom`. */
  side?: PopoverSide;
  /** Panel alignment relative to the trigger. Default: `start` when matching width. */
  align?: FloatingAlign;
  offset?: number;
  /** Props forwarded to the inner `ListBox` (controlled selection props are owned by ComboBox). */
  listBoxProps?: Omit<
    ListBoxProps,
    | "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "activeValue"
    | "onActiveValueChange"
    | "listId"
  >;
};
 
export type ComboBoxLabelProps = Omit<LabelProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & {
  motion?: Prettify<ComboBoxPartMotion>;
};
 
export type ComboBoxHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: InputStatus;
  motion?: Prettify<ComboBoxPartMotion>;
};
 
export type ComboBoxErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<ComboBoxPartMotion>;
};
 
export type UseComboBoxRootStateProps = ComboBoxProps;
 