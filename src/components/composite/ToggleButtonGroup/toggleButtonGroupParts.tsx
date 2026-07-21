import { buttonGroupSeparatorClass } from "@/components/composite/ButtonGroup/buttonGroupStyles";

import { useToggleButtonGroupClassNames } from "./toggleButtonGroupContext";
import type { ToggleButtonGroupOrientation } from "./toggleButtonGroupTypes";

export function ToggleButtonGroupSeparator({
  orientation,
}: {
  orientation: ToggleButtonGroupOrientation;
}) {
  const slotClassNames = useToggleButtonGroupClassNames();
  return (
    <span
      aria-hidden
      className={buttonGroupSeparatorClass(orientation, slotClassNames.separator)}
    />
  );
}
