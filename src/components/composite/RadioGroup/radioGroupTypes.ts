import type { FieldsetHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

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

export type RadioGroupClassNames = OptionGroupClassNames;

export type RadioGroupContextValue = {
  name: string;
  disabled: boolean;
  required: boolean;
  hintId: string;
  errorId: string;
  selectedValue: string | undefined;
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
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** id for `aria-describedby`; generated automatically by default. */
  hintId?: string;
  /** id for error in `aria-describedby`; generated automatically by default. */
  errorId?: string;
  size?: ComponentSize;
  children?: ReactNode;
  classNames?: Prettify<RadioGroupClassNames>;
  /**
   * Per-slot motion (`root`, `list`, `legend`, `hint`, `error`, `actions`).
   * Items keep Radio motion. `change` plays on `root` when value updates.
   * `Group` is not a slot. Defaults are empty.
   */
  motion?: Prettify<RadioGroupMotion>;
};

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
