import {
  CheckboxContent,
  CheckboxControl,
  CheckboxError,
  CheckboxHint,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "./Checkbox";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";

const CheckboxIndicatorCompound = Object.assign(CheckboxIndicator, {
  Fill: SelectionIndicator.Fill,
  Mark: SelectionIndicator.Mark,
});

export const Checkbox = Object.assign(CheckboxRoot, {
  Control: CheckboxControl,
  Indicator: CheckboxIndicatorCompound,
  Content: CheckboxContent,
  Label: CheckboxLabel,
  Hint: CheckboxHint,
  Error: CheckboxError,
});

export type {
  CheckboxProps,
  CheckboxRootProps,
  CheckboxControlProps,
  CheckboxIndicatorProps,
  CheckboxContentProps,
  CheckboxLabelProps,
  CheckboxHintProps,
  CheckboxErrorProps,
  CheckboxSize,
  CheckboxVariant,
  CheckboxClassNames,
} from "./checkboxTypes";
