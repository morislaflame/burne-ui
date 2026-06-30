import {
  CheckboxContent,
  CheckboxControl,
  CheckboxError,
  CheckboxHint,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "./Checkbox";

export const Checkbox = Object.assign(CheckboxRoot, {
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
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
