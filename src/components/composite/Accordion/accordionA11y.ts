export function accordionHeadingTag(): "h3" {
  return "h3";
}

/** Chevron / decorative SVG inside Accordion.Chevron. */
export function accordionDecorativeProps() {
  return { "aria-hidden": true as const };
}
