/**
 * Shared viewport breakpoints — keep CSS media queries in sync
 * (`field-control-mobile-no-zoom` in `src/styles.css`).
 *
 * `1024px` aligns with Tailwind `lg` (tablet / narrow desktop).
 */
export const NARROW_VIEWPORT_MAX_PX = 1024;

/** Hover-lift skip: narrow viewport, no hover, or coarse pointer. */
export const TOUCH_OR_NARROW_VIEWPORT_MQL =
  `(max-width: ${NARROW_VIEWPORT_MAX_PX}px), (hover: none), (pointer: coarse)`;

/**
 * Same as {@link TOUCH_OR_NARROW_VIEWPORT_MQL}, plus `any-pointer: coarse`
 * (iPad with a mouse attached — still prefer 16px inputs).
 */
export const TOUCH_OR_NARROW_VIEWPORT_MQL_ANY_POINTER =
  `${TOUCH_OR_NARROW_VIEWPORT_MQL}, (any-pointer: coarse)`;
