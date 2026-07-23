/**
 * Overlay z-index scale — match `--z-*` tokens and `z-*` utilities.
 *
 * Hierarchy (low → high): dialog → dropdown / popover → toast → tooltip.
 * Applies inside one stacking context. Default modal Dialog (`showModal()`) uses
 * the browser top layer — body portals cannot outrank it via z-index alone.
 * `dropdown-sub` is slightly above `dropdown` for nested menus.
 */
export const burneZIndexScale = [
  "dialog",
  "dropdown",
  "dropdown-sub",
  "popover",
  "toast",
  "tooltip",
] as const;

export type ZIndexLayer = (typeof burneZIndexScale)[number];

export const Z_INDEX_CSS_VAR: Record<ZIndexLayer, `--z-${ZIndexLayer}`> = {
  dialog: "--z-dialog",
  dropdown: "--z-dropdown",
  "dropdown-sub": "--z-dropdown-sub",
  popover: "--z-popover",
  toast: "--z-toast",
  tooltip: "--z-tooltip",
};

/** Default numeric values (`dropdown-sub` resolves via CSS `calc(var(--z-dropdown) + 10)`). */
export const Z_INDEX_DEFAULTS: Record<ZIndexLayer, number> = {
  dialog: 100,
  dropdown: 200,
  "dropdown-sub": 210,
  popover: 200,
  toast: 300,
  tooltip: 400,
};

/** CSS `var(--z-dialog|…)` for inline styles and documentation. */
export function zIndexToken<L extends ZIndexLayer>(layer: L): `var(--z-${L})` {
  return `var(--z-${layer})` as `var(--z-${L})`;
}
