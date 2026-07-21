import { createOptionGroupErrorPart, createOptionGroupHintPart, createOptionGroupLegendPart, createOptionGroupListPart } from "@/components/composite/utils/optionGroupParts";

import { useRadioGroupClassNames, useRadioGroupContext } from "./radioGroupContext";

export const RadioGroupLegend = createOptionGroupLegendPart("RadioGroup.Legend");

export const RadioGroupHint = createOptionGroupHintPart(
  () => useRadioGroupContext().hintId,
  () => useRadioGroupClassNames().hint,
  "RadioGroup.Hint",
);

export const RadioGroupError = createOptionGroupErrorPart(
  () => useRadioGroupContext().errorId,
  () => useRadioGroupClassNames().error,
  "RadioGroup.Error",
);

export const RadioGroupList = createOptionGroupListPart(
  () => useRadioGroupClassNames().list,
  "RadioGroup.List",
);
