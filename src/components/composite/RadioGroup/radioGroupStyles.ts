import { cn } from "@/utils/cn";
 
import {
  OPTION_GROUP_ORIENTATION_LAYOUT,
  type OptionGroupOrientation,
} from "@/components/composite/utils/optionGroupLayout";
 
export type { OptionGroupOrientation as RadioGroupListOrientation };
 
export function radioGroupListClass(
  orientation: OptionGroupOrientation = "vertical",
  className?: string,
): string {
  return cn("text-start", OPTION_GROUP_ORIENTATION_LAYOUT[orientation], className);
}
 