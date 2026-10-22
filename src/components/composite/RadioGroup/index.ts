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
  Hint: RadioGroupHint,
  Error: RadioGroupError,
  List: RadioGroupList,
  Group: OptionGroupGroup,
  Actions: RadioGroupActions,
});
 
export type {
  RadioGroupProps,
  RadioGroupOrientation,
  RadioGroupSize,
  RadioGroupClassNames,
  RadioGroupHintProps,
  RadioGroupErrorProps,
  RadioGroupActionsProps,
  RadioGroupItem,
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
 