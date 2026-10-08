import { Label } from "@/components/core/Label";
import { OptionGroupGroup } from "@/components/composite/utils/optionGroupFieldset";
 
import {
  CheckboxGroupActions,
  CheckboxGroupError,
  CheckboxGroupHint,
  CheckboxGroupLegend,
  CheckboxGroupList,
  CheckboxGroupRoot,
} from "./CheckboxGroup";
 
export const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Legend: CheckboxGroupLegend,
  Label,
  Hint: CheckboxGroupHint,
  Error: CheckboxGroupError,
  List: CheckboxGroupList,
  Group: OptionGroupGroup,
  Actions: CheckboxGroupActions,
});
 
export type {
  CheckboxGroupProps,
  CheckboxGroupSelection,
  CheckboxGroupOrientation,
  CheckboxGroupClassNames,
  CheckboxGroupHintProps,
  CheckboxGroupLabelProps,
  CheckboxGroupLegendProps,
  CheckboxGroupListProps,
  CheckboxGroupErrorProps,
  CheckboxGroupActionsProps,
  CheckboxGroupMotion,
  CheckboxGroupPartMotion,
} from "./checkboxGroupTypes";
 
export type { CheckboxGroupContextValue } from "./checkboxGroupTypes";
 
export {
  useCheckboxGroupContext,
  useOptionalCheckboxGroupContext,
} from "./checkboxGroupContext";
 