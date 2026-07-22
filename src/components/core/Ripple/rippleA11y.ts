/** Ripple layer is paint-only; announce via the interactive host. */
export function rippleLayerA11yProps() {
  return { "aria-hidden": true as const };
}
