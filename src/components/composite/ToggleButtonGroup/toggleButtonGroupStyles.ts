import { buttonGroupRootClass } from "@/components/composite/ButtonGroup/buttonGroupStyles";

export function toggleButtonGroupRootClass(
  options: Parameters<typeof buttonGroupRootClass>[0],
): string {
  return buttonGroupRootClass(options);
}
