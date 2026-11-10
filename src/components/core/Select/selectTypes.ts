import type { HTMLAttributes, RefObject, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputVariant } from "@/components/core/Input";
import type { LabelProps } from "@/components/core/Label";
import type { ListBoxProps } from "@/components/core/ListBox";
import type { PopoverSide } from "@/components/core/Popover";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
 
export type SelectSize = InputSize;
export type SelectVariant = InputVariant;

export type SelectItem = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

/** Named group inside `items`. Flat items and groups can sit in one list. */
export type SelectItemGroup = {
  label: string;
  items: readonly SelectItem[];
};

export type SelectItemSection = {
  label?: string;
  items: SelectItem[];
};
 
export type SelectClassNames = {
  root?: string;
  label?: string;
  shell?: string;
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
  shell?: SelectPartMotion;
  value?: SelectPartMotion;
  trigger?: SelectPartMotion;
  triggerIconWrap?: SelectPartMotion;
  label?: SelectPartMotion;
  hint?: SelectPartMotion;
  error?: SelectPartMotion;
  /**
   * Menu panel. Forwarded to the inner Popover `content` slot (not registered on the field scope).
   */
  popover?: SelectPartMotion;
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
  readOnly?: boolean;
  size?: InputSize;
  items?: readonly (SelectItem | SelectItemGroup)[];
  /** Shows a clear control when a value is selected. Sets `null` / `[]`. */
  clearable?: boolean;
  /** Menu portal host. Default: `document.body`. A node inside the document is contained. */
  portalContainer?: HTMLElement | null;
  /** Simple API chevron. A node replaces it. `null` hides it. `Select.Trigger` children still replace the chevron. */
  icon?: ReactNode | null;
  /** `multiple` keeps the menu open and toggles each choice. */
  selectionMode?: "single" | "multiple";
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
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
  /** Mount only the visible items. Flat `items` list. */
  virtualized?: boolean;
  /** Fixed option height in px. Measured from the first row when omitted. */
  virtualItemSize?: number;
  classNames?: Prettify<SelectClassNames>;
  /**
   * Per-slot motion (`shell`, `value`, `trigger`, `triggerIconWrap`, `label`, `hint`, `error`, `popover`).
   * `popover` is forwarded to the inner Popover `content` (`portalSurfaceEnter` / `portalSurfaceLeave`).
   * Chrome registers on the Root scope (siblings of TriggerGroup). TriggerGroup is the nested shell host.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * Simple API: `motionController` is forwarded to `Select.Shell` (shell host).
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
  items: readonly (SelectItem | SelectItemGroup)[];
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
  readOnly: boolean;
  placeholder: string;
  menuMaxHeight: string;
  virtualized: boolean;
  virtualItemSize?: number;
  items: SelectItem[];
  optionSections: SelectItemSection[];
  clearable: boolean;
  portalContainer?: HTMLElement | null;
  icon?: ReactNode | null;
  optionValues: string[];
  formValueRef?: (node: HTMLButtonElement | null) => void;
  formOnBlur?: () => void;
};
 
export type SelectClassNamesProviderProps = {
  classNames?: Prettify<SelectClassNames>;
  children: ReactNode;
};
 
export type SelectShellProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
  /** Part motion for the `shell` host slot. Root `motion.shell` still applies. */
  motion?: Prettify<SelectPartMotion>;
  /**
   * Deferred handle for the TriggerGroup host (`shell`, `value`, `trigger`, `triggerIconWrap`).
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
  /**
   * Menu panel motion. Wins over `motion.popover` on the root.
   * Forwarded to the inner Popover `content` slot.
   */
  motion?: Prettify<SelectPartMotion>;
  /** Preferred side relative to the trigger. Default: `bottom`. */
  side?: PopoverSide;
  /** Overrides the root `portalContainer`. */
  portalContainer?: HTMLElement | null;
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
  motion?: Prettify<SelectPartMotion>;
};
 
export type SelectErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  motion?: Prettify<SelectPartMotion>;
};
 
export type UseSelectRootStateProps = SelectProps;
 