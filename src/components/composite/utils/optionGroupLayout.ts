export type OptionGroupOrientation = "vertical" | "horizontal";

export const OPTION_GROUP_ORIENTATION_LAYOUT: Record<OptionGroupOrientation, string> = {
  vertical: "flex flex-col gap-plus",
  horizontal: "flex flex-row flex-wrap items-start gap-x-mid gap-y-plus",
};
