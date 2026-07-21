export {
  ToggleButtonRoot,
  ToggleButtonContent,
  ToggleButtonFill,
  ToggleButtonLabel,
  ToggleButtonIconStart,
  ToggleButtonIconEnd,
  ToggleButtonText,
  type ToggleButtonProps,
  type ToggleButtonSize,
  type ToggleButtonVariant,
  type ToggleButtonClassNames,
  type ToggleButtonFillProps,
  type ToggleButtonContentProps,
  type ToggleButtonLabelProps,
  type ToggleButtonIconStartProps,
  type ToggleButtonIconEndProps,
  type ToggleButtonTextProps,
} from "./ToggleButton";

import { ToggleButtonRoot, ToggleButtonContent, ToggleButtonFill, ToggleButtonLabel, ToggleButtonIconStart, ToggleButtonIconEnd, ToggleButtonText } from "./ToggleButton";

export const ToggleButton = Object.assign(ToggleButtonRoot, {
  Content: ToggleButtonContent,
  Fill: ToggleButtonFill,
  Label: ToggleButtonLabel,
  IconStart: ToggleButtonIconStart,
  IconEnd: ToggleButtonIconEnd,
  Text: ToggleButtonText,
});

export { useOptionalToggleButtonGroupContext } from "./toggleButtonContext";

export type {
  ToggleButtonGroupType,
  ToggleButtonGroupOrientation,
  ToggleButtonGroupContextValue,
} from "./toggleButtonTypes";
