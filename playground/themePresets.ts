/**
 * Theme builder presets (colors / fonts / layout).
 * Lives in playground — not in the burne-ui package runtime API.
 */
import { DARK_COLORS, DEFAULT_FONT, DEFAULT_FONT_MONO, LIGHT_COLORS } from "./themeDefaults";

export const LAYOUT_PRESETS = {
  compact: { space: 0.4, size: 0.9, radius: 0.375, borderWidth: 1, textScale: 0.95 },
  spacious: { space: 0.625, size: 1.125, radius: 0.625, borderWidth: 1, textScale: 1.05 },
  flat: { space: 0.5, size: 1, radius: 0.375, borderWidth: 0, textScale: 1 },
} as const;

export type LayoutPresetKey = keyof typeof LAYOUT_PRESETS;

export const FONT_PRESETS = [
  { id: "system", label: "System UI", value: DEFAULT_FONT },
  { id: "inter", label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { id: "geist", label: "Geist", value: "Geist, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "plex-sans",
    label: "IBM Plex Sans",
    value: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "dm-sans", label: "DM Sans", value: '"DM Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "manrope", label: "Manrope", value: "Manrope, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "source-sans",
    label: "Source Sans 3",
    value: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "outfit", label: "Outfit", value: "Outfit, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans",
    value: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "roboto", label: "Roboto", value: "Roboto, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "open-sans",
    label: "Open Sans",
    value: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "figtree", label: "Figtree", value: "Figtree, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "nunito-sans",
    label: "Nunito Sans",
    value: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "work-sans",
    label: "Work Sans",
    value: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
  },
] as const;

export const MONO_FONT_PRESETS = [
  { id: "system", label: "System Mono", value: DEFAULT_FONT_MONO },
  {
    id: "jetbrains",
    label: "JetBrains Mono",
    value: '"JetBrains Mono", ui-monospace, monospace',
  },
  { id: "fira", label: "Fira Code", value: '"Fira Code", ui-monospace, monospace' },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    value: '"Source Code Pro", ui-monospace, monospace',
  },
  { id: "roboto-mono", label: "Roboto Mono", value: '"Roboto Mono", ui-monospace, monospace' },
  {
    id: "plex-mono",
    label: "IBM Plex Mono",
    value: '"IBM Plex Mono", ui-monospace, monospace',
  },
  { id: "space-mono", label: "Space Mono", value: '"Space Mono", ui-monospace, monospace' },
] as const;

export { DARK_COLORS, LIGHT_COLORS };
