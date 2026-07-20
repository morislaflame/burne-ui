import {
  createOptionGroupErrorPart,
  createOptionGroupHintPart,
  createOptionGroupLegendPart,
  createOptionGroupListPart,
} from "@/components/composite/utils/optionGroupParts";

import { useCheckboxGroupContext } from "./checkboxGroupContext";

export const CheckboxGroupLegend = createOptionGroupLegendPart("CheckboxGroup.Legend");

export const CheckboxGroupHint = createOptionGroupHintPart(
  () => useCheckboxGroupContext().hintId,
  "CheckboxGroup.Hint",
);

export const CheckboxGroupError = createOptionGroupErrorPart(
  () => useCheckboxGroupContext().errorId,
  "CheckboxGroup.Error",
);

export const CheckboxGroupList = createOptionGroupListPart("CheckboxGroup.List");
