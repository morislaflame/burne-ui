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
} from "./selectionIndicatorTypes";

export {
  SELECTION_INDICATOR_FILL_CLASS,
  SELECTION_INDICATOR_ICON_CLASS,
  SELECTION_INDICATOR_RADIUS_CLASS,
  SELECTION_INDICATOR_SHELL_CLASS,
  SELECTION_INDICATOR_SIZE_CLASS,
  selectionIndicatorFallbackPx,
  selectionIndicatorShellClass,
  selectionIndicatorVariantClass,
  type SelectionIndicatorSize,
  type SelectionIndicatorVariant,
} from "./selectionIndicatorTokens";

export {
  SELECTION_INDICATOR_FILL_DISPLAY_NAME,
  SELECTION_INDICATOR_MARK_DISPLAY_NAME,
} from "./selectionIndicatorAPI";

export { useSelectionIndicatorAnimation } from "./useSelectionIndicatorAnimation";
