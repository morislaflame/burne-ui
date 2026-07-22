export const BUTTON_GROUP_ROLE = "group" as const;

/** Segment dividers are visual only. */
export function buttonGroupSeparatorA11yProps() {
  return { "aria-hidden": true as const };
}
