import { cn } from "@/utils/cn";
 
import type { OptionGroupOrientation } from "@/components/composite/utils/optionGroupLayout";
import { OPTION_GROUP_ORIENTATION_LAYOUT } from "@/components/composite/utils/optionGroupStyles";
 
export type { OptionGroupOrientation as CheckboxGroupListOrientation };
 
export function checkboxGroupListClass(
  orientation: OptionGroupOrientation = "vertical",
  className?: string,
): string {
  return cn("text-start", OPTION_GROUP_ORIENTATION_LAYOUT[orientation], className);
}
 