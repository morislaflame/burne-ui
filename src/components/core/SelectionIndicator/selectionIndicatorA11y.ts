/** Shell / fill / mark are decorative; selection semantics live on the control. */
export function selectionIndicatorDecorativeProps() {
  return { "aria-hidden": true as const };
}
