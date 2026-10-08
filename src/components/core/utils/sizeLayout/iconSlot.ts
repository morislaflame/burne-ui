/** Steps of `icon-slot-*`. Each utility sets `--icon-size`; `.icon-slot > svg` reads it. */
export type IconSlotStep =
  | "xsmall"
  | "small"
  | "base"
  | "mid"
  | "large"
  | "xlarge"
  | "2xlarge"
  | "3xlarge"
  | "16"
  | "24";

/** Marker on the icon wrap. The child rule lives in `@layer ui-kit`. */
export const ICON_SLOT_CLASS = "icon-slot";

/** Size utility. `cn` treats every `icon-slot-*` as one group. */
export function iconSlotSizeClass(step: IconSlotStep): string {
  return `icon-slot-${step}`;
}

/** Wrap marker plus the size utility that sets `--icon-size`. */
export function iconSlotClass(step: IconSlotStep): string {
  return `${ICON_SLOT_CLASS} ${iconSlotSizeClass(step)}`;
}
