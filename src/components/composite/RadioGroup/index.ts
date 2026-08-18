import { Label } from "@/components/core/Label";
import { OptionGroupGroup } from "@/components/composite/utils/optionGroupFieldset";

import {
  RadioGroupActions,
  RadioGroupError,
  RadioGroupHint,
  RadioGroupLegend,
  RadioGroupList,
  RadioGroupRoot,
} from "./RadioGroup";

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Legend: RadioGroupLegend,
  Label,
  Hint: RadioGroupHint,
  Error: RadioGroupError,
  List: RadioGroupList,
  Group: OptionGroupGroup,
  Actions: RadioGroupActions,
});

export type {
  RadioGroupProps,
  RadioGroupOrientation,
  RadioGroupClassNames,
  RadioGroupHintProps,
  RadioGroupErrorProps,
  RadioGroupActionsProps,
  RadioGroupLabelProps,
  RadioGroupLegendProps,
  RadioGroupListProps,
  RadioGroupMotion,
  RadioGroupPartMotion,
} from "./radioGroupTypes";

export type { RadioGroupContextValue } from "./radioGroupTypes";

export {
  useRadioGroupContext,
  useOptionalRadioGroupContext,
} from "./radioGroupContext";
