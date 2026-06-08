import { FieldError, FieldHint, FieldLabel, FieldRoot } from "./Field";
import {
  FieldLegend,
  FieldLegendHeader,
  FieldSetActions,
  FieldSetGroup,
  FieldSetRoot,
  useFieldSetErrorId,
  useFieldSetHintId,
} from "./FieldSet";
import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "./fieldA11y";

const FieldSet = Object.assign(FieldSetRoot, {
  Legend: FieldLegend,
  LegendHeader: FieldLegendHeader,
  Group: FieldSetGroup,
  Actions: FieldSetActions,
});

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
