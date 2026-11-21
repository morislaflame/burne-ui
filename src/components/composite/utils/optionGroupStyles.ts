import type { OptionGroupOrientation } from "./optionGroupLayout";

export const OPTION_GROUP_ORIENTATION_LAYOUT: Record<OptionGroupOrientation, string> = {
  vertical: "flex flex-col gap-mid",
  horizontal: "flex flex-row flex-wrap items-start gap-x-large gap-y-mid",
};
