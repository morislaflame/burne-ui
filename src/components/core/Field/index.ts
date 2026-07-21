import { FieldError, FieldHint, FieldLabel, FieldLegend, FieldLegendHeader, FieldRoot, FieldSetActions, FieldSetGroup, FieldSetRoot, useFieldSetErrorId, useFieldSetHintId } from "./Field";
import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "./fieldA11y";

const FieldSet = Object.assign(FieldSetRoot, {
  Legend: FieldLegend,
  LegendHeader: FieldLegendHeader,
  Group: FieldSetGroup,
  Actions: FieldSetActions,
});

export const Field = Object.assign(FieldRoot, {
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
  FieldSetRoot,
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
  FieldSetProps,
  FieldSetGroupProps,
  FieldSetActionsProps,
  FieldLegendProps,
  FieldLegendHeaderProps,
  FieldSetSize,
  FieldClassNames,
  FieldSetClassNames,
} from "./fieldTypes";
