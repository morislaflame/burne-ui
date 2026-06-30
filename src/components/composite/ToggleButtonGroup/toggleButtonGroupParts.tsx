import type { ToggleButtonGroupOrientation } from "./toggleButtonGroupTypes";
import { toggleButtonGroupSeparatorClass } from "./toggleButtonGroupStyles";

export function ToggleButtonGroupSeparator({
  orientation,
}: {
  orientation: ToggleButtonGroupOrientation;
}) {
  return <span aria-hidden className={toggleButtonGroupSeparatorClass(orientation)} />;
}
