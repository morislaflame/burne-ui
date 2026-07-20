import {
  createOptionGroupErrorPart,
  createOptionGroupHintPart,
  createOptionGroupLegendPart,
  createOptionGroupListPart,
} from "@/components/composite/utils/optionGroupParts";

import { useRadioGroupContext } from "./radioGroupContext";

export const RadioGroupLegend = createOptionGroupLegendPart("RadioGroup.Legend");

export const RadioGroupHint = createOptionGroupHintPart(
  () => useRadioGroupContext().hintId,
  "RadioGroup.Hint",
);

export const RadioGroupError = createOptionGroupErrorPart(
  () => useRadioGroupContext().errorId,
  "RadioGroup.Error",
);

export const RadioGroupList = createOptionGroupListPart("RadioGroup.List");
