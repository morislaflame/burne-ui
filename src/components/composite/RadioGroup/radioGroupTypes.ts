import type { FieldsetHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { FieldErrorProps } from "@/components/core/Field";
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
};

export type UseRadioGroupRootStateProps = RadioGroupProps;

export type RadioGroupHintProps = OptionGroupHintProps;
export type RadioGroupLegendProps = OptionGroupLegendProps;
export type RadioGroupListProps = OptionGroupListProps;
export type RadioGroupErrorProps = FieldErrorProps;
export type RadioGroupLabelProps = LabelProps;
