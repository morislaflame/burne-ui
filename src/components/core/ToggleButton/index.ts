import { ToggleButtonRoot, ToggleButtonContent, ToggleButtonFill, ToggleButtonLabel, ToggleButtonIconStart, ToggleButtonIconEnd, ToggleButtonText } from "./ToggleButton";
 
export const ToggleButton = Object.assign(ToggleButtonRoot, {
  Content: ToggleButtonContent,
  Fill: ToggleButtonFill,
  Label: ToggleButtonLabel,
  IconStart: ToggleButtonIconStart,
  IconEnd: ToggleButtonIconEnd,
  Text: ToggleButtonText,
});
 
export type {
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
  ToggleButtonClassNames,
  ToggleButtonFillProps,
  ToggleButtonContentProps,
  ToggleButtonLabelProps,
  ToggleButtonIconStartProps,
  ToggleButtonIconEndProps,
  ToggleButtonTextProps,
  ToggleButtonMotion,
  ToggleButtonPartMotion,
  ToggleButtonPointerMotion,
} from "./ToggleButton";

export { useOptionalToggleButtonGroupContext } from "./toggleButtonContext";
 
export type {
  ToggleButtonGroupType,
  ToggleButtonGroupOrientation,
  ToggleButtonGroupContextValue,
} from "./toggleButtonTypes";
 