/**
 * Visual skins shared by action controls: Button, ToggleButton, CloseButton.
 * Skin plugin names stay `string & {}` on the component prop, not in this list.
 * `primary` is the filled skin (Button, CloseButton, Badge).
 * ToggleButton paints `default` | `outline` | `ghost` only.
 */
export const ACTION_VARIANTS = [
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
] as const;

export type ActionVariant = (typeof ACTION_VARIANTS)[number];
