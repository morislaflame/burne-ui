import { SelectionIndicator as SelectionIndicatorRoot } from "./SelectionIndicator";
import { SelectionIndicatorFill, SelectionIndicatorMark } from "./selectionIndicatorParts";
 
export const SelectionIndicator = Object.assign(SelectionIndicatorRoot, {
  Fill: SelectionIndicatorFill,
  Mark: SelectionIndicatorMark,
});
 
export type {
  SelectionIndicatorProps,
  SelectionIndicatorClassNames,
  SelectionIndicatorFillProps,
  SelectionIndicatorMarkProps,
  SelectionIndicatorMotion,
  SelectionIndicatorPartMotion,
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
} from "./selectionIndicatorTypes";
 