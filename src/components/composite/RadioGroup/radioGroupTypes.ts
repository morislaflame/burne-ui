import type { FieldsetHTMLAttributes, ReactNode } from "react";

import type { FieldErrorProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import type {
  OptionGroupHintProps,
  OptionGroupLegendProps,
  OptionGroupListProps,
  OptionGroupOrientation,
} from "@/components/composite/utils/optionGroupFieldset";

export type RadioGroupOrientation = OptionGroupOrientation;

export type RadioGroupContextValue = {
  name: string;
  disabled: boolean;
  isRequired: boolean;
  hintId: string;
  errorId: string;
  selectedValue: string | undefined;
  selectValue: (value: string | undefined) => void;
  /** First option in the group claims native `required` when `isRequired`. */
  claimRequiredAnchor: () => boolean;
};

export type RadioGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange"
> & {
  isRequired?: boolean;
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** id for `aria-describedby`; generated automatically by default. */
  hintId?: string;
  /** id for error in `aria-describedby`; generated automatically by default. */
  errorId?: string;
  size?: ComponentSize;
  children?: ReactNode;
};

export type UseRadioGroupRootStateProps = RadioGroupProps;

export type RadioGroupHintProps = OptionGroupHintProps;
export type RadioGroupLegendProps = OptionGroupLegendProps;
export type RadioGroupListProps = OptionGroupListProps;
export type RadioGroupErrorProps = FieldErrorProps;
export type RadioGroupLabelProps = LabelProps;
