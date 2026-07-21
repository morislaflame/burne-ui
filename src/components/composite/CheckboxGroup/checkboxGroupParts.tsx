import { createOptionGroupErrorPart, createOptionGroupHintPart, createOptionGroupLegendPart, createOptionGroupListPart } from "@/components/composite/utils/optionGroupParts";

import { useCheckboxGroupClassNames, useCheckboxGroupContext } from "./checkboxGroupContext";

export const CheckboxGroupLegend = createOptionGroupLegendPart("CheckboxGroup.Legend");

export const CheckboxGroupHint = createOptionGroupHintPart(
  () => useCheckboxGroupContext().hintId,
  () => useCheckboxGroupClassNames().hint,
  "CheckboxGroup.Hint",
);

export const CheckboxGroupError = createOptionGroupErrorPart(
  () => useCheckboxGroupContext().errorId,
  () => useCheckboxGroupClassNames().error,
  "CheckboxGroup.Error",
);

export const CheckboxGroupList = createOptionGroupListPart(
  () => useCheckboxGroupClassNames().list,
  "CheckboxGroup.List",
);
