import {
  buttonGroupRootClass,
  buttonGroupSeparatorClass,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ToggleButtonVariant } from "@/components/core/ToggleButton/toggleButtonTypes";

import type { ToggleButtonGroupOrientation } from "./toggleButtonGroupTypes";

export function toggleButtonGroupRootClass({
  orientation,
  separated,
  variant,
  className,
}: {
  orientation: ToggleButtonGroupOrientation;
  separated: boolean;
  variant: ToggleButtonVariant;
  className?: string;
}): string {
  return buttonGroupRootClass({
    orientation,
    segmented: separated,
    variant,
    className,
  });
}

export function toggleButtonGroupSeparatorClass(
  orientation: ToggleButtonGroupOrientation,
): string {
  return buttonGroupSeparatorClass(orientation);
}
