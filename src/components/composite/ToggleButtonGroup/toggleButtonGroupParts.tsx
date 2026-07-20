import { buttonGroupSeparatorClass } from "@/components/composite/ButtonGroup/buttonGroupStyles";

import type { ToggleButtonGroupOrientation } from "./toggleButtonGroupTypes";

export function ToggleButtonGroupSeparator({
  orientation,
}: {
  orientation: ToggleButtonGroupOrientation;
}) {
  return <span aria-hidden className={buttonGroupSeparatorClass(orientation)} />;
}
