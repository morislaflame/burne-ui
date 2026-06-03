import {
  CheckboxContent,
  CheckboxControl,
  CheckboxError,
  CheckboxHint,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  type CheckboxContentProps,
  type CheckboxControlProps,
  type CheckboxErrorProps,
  type CheckboxHintProps,
  type CheckboxIndicatorProps,
  type CheckboxLabelProps,
  type CheckboxProps,
  type CheckboxRootProps,
} from "./Checkbox";

export type { CheckboxSize, CheckboxVariant } from "./checkboxFieldContext";

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
};
