import { Label } from "@/components/core/Label";
import { OptionGroupActions, OptionGroupGroup } from "@/components/composite/utils/optionGroupFieldset";

import { RadioGroupError, RadioGroupHint, RadioGroupLegend, RadioGroupList, RadioGroupRoot } from "./RadioGroup";

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Legend: RadioGroupLegend,
  Label,
  Hint: RadioGroupHint,
  Error: RadioGroupError,
  List: RadioGroupList,
  Group: OptionGroupGroup,
  Actions: OptionGroupActions,
});

export type {
  RadioGroupProps,
  RadioGroupOrientation,
  RadioGroupHintProps,
  RadioGroupErrorProps,
  RadioGroupLabelProps,
  RadioGroupLegendProps,
  RadioGroupListProps,
} from "./radioGroupTypes";

export type { RadioGroupContextValue } from "./radioGroupTypes";

export {
  useRadioGroupContext,
  useOptionalRadioGroupContext,
} from "./radioGroupContext";
