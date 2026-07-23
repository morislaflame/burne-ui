export function skeletonPresentationProps() {
  return {
    "aria-hidden": true as const,
    role: "presentation" as const,
  };
}

/** Parent loading region — not decorative; announces busy state to AT. */
export function skeletonRegionA11yProps(busy: boolean) {
  return {
    "aria-busy": busy,
    "aria-live": "polite" as const,
  };
}
