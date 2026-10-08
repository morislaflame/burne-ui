import type { FieldsetHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import type { FieldErrorProps, FieldSetActionsProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type {
  OptionGroupHintProps,
  OptionGroupLegendProps,
  OptionGroupListProps,
  OptionGroupOrientation,
} from "@/components/composite/utils/optionGroupFieldset";
import type { OptionGroupClassNames } from "@/components/composite/utils/optionGroupClassNames";
 
export type CheckboxGroupSelection = "multiple" | "single";
 
export type CheckboxGroupClassNames = OptionGroupClassNames;
 
export type CheckboxGroupContextValue = {
  selection: CheckboxGroupSelection;
  disabled: boolean;
  required: boolean;
  hintId: string;
  errorId: string;
  /** Only for `selection="single"`. */
  selectedValue: string | undefined;
  /** Only for `selection="single"`. */
  selectSingleValue: (value: string, checked: boolean) => void;
};
 
export type CheckboxGroupPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  change?: MotionValue;
};
 
export type CheckboxGroupMotion = {
  root?: CheckboxGroupPartMotion;
  list?: CheckboxGroupPartMotion;
  legend?: CheckboxGroupPartMotion;
  hint?: CheckboxGroupPartMotion;
  error?: CheckboxGroupPartMotion;
  actions?: CheckboxGroupPartMotion;
};
 
export type CheckboxGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange"
> & {
  required?: boolean;
  /** `aria-invalid` on the group without an error message. `CheckboxGroup.Error` does the same. */
  invalid?: boolean;
  selection?: CheckboxGroupSelection;
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** id for `aria-describedby`; generated automatically by default. */
  hintId?: string;
  /** id for error in `aria-describedby`; generated automatically by default. */
  errorId?: string;
  /** Fieldset padding scale. By default `small`. */
  size?: ComponentSize;
  children?: ReactNode;
  classNames?: Prettify<CheckboxGroupClassNames>;
  /**
   * Per-slot motion (`root`, `list`, `legend`, `hint`, `error`, `actions`).
   * Items keep Checkbox motion. `change` plays on `root` when `selection="single"`
   * value updates. `Group` is not a slot. Defaults are empty.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<CheckboxGroupMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this group chrome scope (not item Checkbox / SelectionIndicator).
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type UseCheckboxGroupRootStateProps = CheckboxGroupProps;
 
export type CheckboxGroupHintProps = OptionGroupHintProps & {
  motion?: Prettify<CheckboxGroupPartMotion>;
};
export type CheckboxGroupLegendProps = OptionGroupLegendProps & {
  motion?: Prettify<CheckboxGroupPartMotion>;
};
export type CheckboxGroupListProps = OptionGroupListProps & {
  motion?: Prettify<CheckboxGroupPartMotion>;
};
export type CheckboxGroupOrientation = OptionGroupOrientation;
export type CheckboxGroupErrorProps = Omit<FieldErrorProps, "motion"> & {
  motion?: Prettify<CheckboxGroupPartMotion>;
};
export type CheckboxGroupActionsProps = Omit<FieldSetActionsProps, "motion"> & {
  motion?: Prettify<CheckboxGroupPartMotion>;
};
export type CheckboxGroupLabelProps = LabelProps;
 