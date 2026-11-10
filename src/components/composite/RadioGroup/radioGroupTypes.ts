import type { FieldsetHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
 
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
 
export type RadioGroupOrientation = OptionGroupOrientation;
export type RadioGroupSize = ComponentSize;

export type RadioGroupItem = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
};
 
export type RadioGroupClassNames = OptionGroupClassNames;
 
export type RadioGroupContextValue = {
  name: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  /** Id of `RadioGroup.Legend`. The fieldset points `aria-labelledby` here. */
  legendId: string;
  hintId: string;
  errorId: string;
  selectedValue: string | null;
  selectValue: (value: string | undefined) => void;
  /** First option in the group claims native `required` when `required`. */
  claimRequiredAnchor: () => boolean;
};
 
export type RadioGroupPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  change?: MotionValue;
};
 
export type RadioGroupMotion = {
  root?: RadioGroupPartMotion;
  list?: RadioGroupPartMotion;
  legend?: RadioGroupPartMotion;
  hint?: RadioGroupPartMotion;
  error?: RadioGroupPartMotion;
  actions?: RadioGroupPartMotion;
};
 
export type RadioGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange"
> & {
  required?: boolean;
  readOnly?: boolean;
  /** `aria-invalid` on the group without an error message. `RadioGroup.Error` does the same. */
  invalid?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** id for `aria-describedby`; generated automatically by default. */
  hintId?: string;
  /** id for error in `aria-describedby`; generated automatically by default. */
  errorId?: string;
  size?: ComponentSize;
  /** Simple API legend. */
  label?: ReactNode;
  /** Simple API hint. */
  hint?: ReactNode;
  /** Simple API error. */
  error?: ReactNode;
  /** Simple API items. Fills the list that children do not already render. */
  items?: RadioGroupItem[];
  children?: ReactNode;
  classNames?: Prettify<RadioGroupClassNames>;
  /**
   * Per-slot motion (`root`, `list`, `legend`, `hint`, `error`, `actions`).
   * Items keep Radio motion. `change` plays on `root` when value updates.
   * `Group` is not a slot. Defaults are empty.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * `states` — app modes for `motionState` (not a DOM slot, not a phase).
   */
  motion?: Prettify<MotionMapWithEvents<RadioGroupMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this group chrome scope (not item Radio / SelectionIndicator).
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type UseRadioGroupRootStateProps = RadioGroupProps;
 
export type RadioGroupHintProps = OptionGroupHintProps & {
  motion?: Prettify<RadioGroupPartMotion>;
};
export type RadioGroupLegendProps = OptionGroupLegendProps & {
  motion?: Prettify<RadioGroupPartMotion>;
};
export type RadioGroupListProps = OptionGroupListProps & {
  motion?: Prettify<RadioGroupPartMotion>;
};
export type RadioGroupErrorProps = Omit<FieldErrorProps, "motion"> & {
  motion?: Prettify<RadioGroupPartMotion>;
};
export type RadioGroupActionsProps = Omit<FieldSetActionsProps, "motion"> & {
  motion?: Prettify<RadioGroupPartMotion>;
};
export type RadioGroupLabelProps = LabelProps;
 