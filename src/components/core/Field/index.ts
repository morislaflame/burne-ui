import { FieldError, FieldHint, FieldLabel, FieldRoot } from "./Field";
import {
  FieldLegend,
  FieldLegendHeader,
  FieldSet,
  FieldSetActions,
  FieldSetGroup,
  useFieldSetErrorId,
  useFieldSetHintId,
} from "./FieldSet";
import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "./fieldA11y";

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Hint: FieldHint,
  Label: FieldLabel,
  Error: FieldError,
  Set: FieldSet,
  Legend: FieldLegend,
  LegendHeader: FieldLegendHeader,
  Group: FieldSetGroup,
  Actions: FieldSetActions,
});

export {
  FieldRoot,
  FieldHint,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldSetGroup,
  FieldSetActions,
  FieldLegend,
  FieldLegendHeader,
  useFieldSetHintId,
  useFieldSetErrorId,
  joinFieldDescribedBy,
  fieldHintId,
  fieldErrorId,
};

export type {
  FieldRootProps,
  FieldHintProps,
  FieldHintStatus,
  FieldLabelProps,
  FieldErrorProps,
} from "./Field";

export type {
  FieldSetProps,
  FieldSetGroupProps,
  FieldSetActionsProps,
  FieldLegendProps,
  FieldLegendHeaderProps,
} from "./FieldSet";
