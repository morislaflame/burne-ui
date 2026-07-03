export {
  ToggleButtonRoot,
  ToggleButtonContent,
  ToggleButtonFill,
  ToggleButtonLabel,
  ToggleButtonIcon,
  ToggleButtonTrailing,
  ToggleButtonText,
  type ToggleButtonProps,
  type ToggleButtonSize,
  type ToggleButtonVariant,
  type ToggleButtonClassNames,
  type ToggleButtonFillProps,
  type ToggleButtonContentProps,
  type ToggleButtonLabelProps,
  type ToggleButtonIconProps,
  type ToggleButtonTrailingProps,
  type ToggleButtonTextProps,
} from "./ToggleButton";

import {
  ToggleButtonRoot,
  ToggleButtonContent,
  ToggleButtonFill,
  ToggleButtonLabel,
  ToggleButtonIcon,
  ToggleButtonTrailing,
  ToggleButtonText,
} from "./ToggleButton";

export const ToggleButton = Object.assign(ToggleButtonRoot, {
  Content: ToggleButtonContent,
  Fill: ToggleButtonFill,
  Label: ToggleButtonLabel,
  Icon: ToggleButtonIcon,
  Trailing: ToggleButtonTrailing,
  Text: ToggleButtonText,
});

export {
  useOptionalToggleButtonGroupContext,
  type ToggleButtonGroupType,
  type ToggleButtonGroupOrientation,
  type ToggleButtonGroupContextValue,
} from "./toggleButtonGroupContext";
