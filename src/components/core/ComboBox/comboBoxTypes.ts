import type { HTMLAttributes, InputHTMLAttributes, MutableRefObject, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputVariant } from "@/components/core/Input";
import type { LabelProps } from "@/components/core/Label";
import type { ListBoxProps } from "@/components/core/ListBox";
import type { PopoverSide } from "@/components/core/Popover";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
 
export type ComboBoxSize = InputSize;
export type ComboBoxVariant = InputVariant;

export type ComboBoxItem = {
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
  shell?: string;
  input?: string;
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
 
export type ComboBoxPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type ComboBoxMotion = {
  shell?: ComboBoxPartMotion;
  input?: ComboBoxPartMotion;
  trigger?: ComboBoxPartMotion;
  triggerIconWrap?: ComboBoxPartMotion;
  label?: ComboBoxPartMotion;
  hint?: ComboBoxPartMotion;
  error?: ComboBoxPartMotion;
  /**
   * Menu panel. Forwarded to the inner Popover `content` slot (not registered on the field scope).
   */
  popover?: ComboBoxPartMotion;
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
  readOnly?: boolean;
  size?: InputSize;
  /** Replaces the default text match. Receives the option and the current query. */
  filter?: (option: ComboBoxItem, query: string) => boolean;
  /** Enter commits the typed text when it is not an option value. */
  allowsCustomValue?: boolean;
  /** Menu shows a busy status instead of items. */
  loading?: boolean;
  items?: ComboBoxItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Text in the field. Drives the option filter. */
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: InputVariant;
  disabled?: boolean;
  placeholder?: string;
  menuMaxHeight?: string;
  /** Menu portal host. Default: `document.body`. A node inside the document is contained. */
  portalContainer?: HTMLElement | null;
  /** Mount only the visible items. Flat `items` list. */
  virtualized?: boolean;
  /** Fixed option height in px. Measured from the first row when omitted. */
  virtualItemSize?: number;
  classNames?: Prettify<ComboBoxClassNames>;
  /**
   * Per-slot motion (`shell`, `input`, `trigger`, `triggerIconWrap`, `label`, `hint`, `error`, `popover`).
   * `popover` is forwarded to the inner Popover `content` (`portalSurfaceEnter` / `portalSurfaceLeave`).
   * Chrome registers on the Root scope (siblings of InputGroup). InputGroup is the nested shell host.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * Simple API: `motionController` is forwarded to `ComboBox.Shell` (shell host).
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
  items: ComboBoxItem[];
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
  readOnly: boolean;
  placeholder: string;
  menuMaxHeight: string;
  portalContainer?: HTMLElement | null;
  virtualized: boolean;
  virtualItemSize?: number;
  items: ComboBoxItem[];
  filteredValues: string[];
  allowsCustomValue: boolean;
  loading: boolean;
  filter?: (option: ComboBoxItem, query: string) => boolean;
  /** Bumped when a list choice commits, so a blur does not overwrite it. */
  blurGeneration: RefObject<number>;
  cancelBlurCommit: () => void;
  formInputRef?: (node: HTMLInputElement | null) => void;
  formOnBlur?: () => void;
};
 
export type ComboBoxClassNamesProviderProps = {
  classNames?: Prettify<ComboBoxClassNames>;
  children: ReactNode;
};
 
export type ComboBoxShellProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
  /** Part motion for the `shell` host slot. Root `motion.shell` still applies. */
  motion?: Prettify<ComboBoxPartMotion>;
  /**
   * Deferred handle for the InputGroup host (`shell`, `input`, `trigger`, `triggerIconWrap`).
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
  /**
   * Menu panel motion. Wins over `motion.popover` on the root.
   * Forwarded to the inner Popover `content` slot.
   */
  motion?: Prettify<ComboBoxPartMotion>;
  /** Preferred side relative to the trigger. Default: `bottom`. */
  side?: PopoverSide;
  /** Overrides the root `portalContainer`. */
  portalContainer?: HTMLElement | null;
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
  motion?: Prettify<ComboBoxPartMotion>;
};
 
export type ComboBoxErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<ComboBoxPartMotion>;
};
 
export type UseComboBoxRootStateProps = ComboBoxProps;
 