import { Label } from "@/components/core/Label";
import { OptionGroupActions, OptionGroupGroup } from "@/components/composite/utils/optionGroupFieldset";

import { CheckboxGroupError, CheckboxGroupHint, CheckboxGroupLegend, CheckboxGroupList, CheckboxGroupRoot } from "./CheckboxGroup";

export const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Legend: CheckboxGroupLegend,
  Label,
  Hint: CheckboxGroupHint,
  Error: CheckboxGroupError,
  List: CheckboxGroupList,
  Group: OptionGroupGroup,
  Actions: OptionGroupActions,
});

export type {
  CheckboxGroupProps,
  CheckboxGroupSelection,
  CheckboxGroupOrientation,
  CheckboxGroupHintProps,
  CheckboxGroupLabelProps,
  CheckboxGroupLegendProps,
  CheckboxGroupListProps,
  CheckboxGroupErrorProps,
} from "./checkboxGroupTypes";

export type { CheckboxGroupContextValue } from "./checkboxGroupTypes";

export {
  useCheckboxGroupContext,
  useOptionalCheckboxGroupContext,
} from "./checkboxGroupContext";
