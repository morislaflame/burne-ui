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

export type CheckboxGroupSelection = "multiple" | "single";

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
  /** First option claims native `required` when `required` (single selection only). */
  claimRequiredAnchor: () => boolean;
};

export type CheckboxGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange"
> & {
  required?: boolean;
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
};

export type UseCheckboxGroupRootStateProps = CheckboxGroupProps;

export type CheckboxGroupHintProps = OptionGroupHintProps;
export type CheckboxGroupLegendProps = OptionGroupLegendProps;
export type CheckboxGroupListProps = OptionGroupListProps;
export type CheckboxGroupOrientation = OptionGroupOrientation;
export type CheckboxGroupErrorProps = FieldErrorProps;
export type CheckboxGroupLabelProps = LabelProps;
