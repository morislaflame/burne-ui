/**
 * Headless studio model (`burne-ui/studio`).
 * Experimental in 2.x until the studio ships (F6). The name list is snapshotted
 * in `docs/studio-api.snapshot.txt`. Result shapes of `validateDesign` and the
 * schema control types stay free to change until then.
 * The site canvas imports this. It does not keep a second copy of the knobs.
 */
export {
  DESIGN_DOCUMENT_SCHEMA,
  DESIGN_DOCUMENT_VERSION,
  contrastRatio,
  designThemeToState,
  parseCssColor,
  parseDesignDocument,
  renderDesignCss,
  validateDesign,
  type DesignDocument,
  type DesignMeta,
  type DesignParseResult,
  type DesignTheme,
  type DesignValidation,
} from "@/studio/designDocument";
export {
  THEME_TOKEN_SCHEMA,
  themeTokenSchemaEntry,
  type ThemeTokenControlType,
  type ThemeTokenSchemaEntry,
} from "@/studio/themeTokenSchema";
export {
  isLiveSkinSlot,
  StudioModeProvider,
  useStudioMode,
} from "@/studio/studioMode";
export { skinSlotId, useStudioSlotRef } from "@/studio/studioModeContext";
export { findMotionController } from "@/studio/studioNodes";
export {
  forceStateAttribute,
  FORCE_STATE_TOKENS,
  playForceStateMotion,
  type ForceStateToken,
} from "@/studio/forceState";
export { paletteFromBrand } from "@/studio/paletteFromBrand";
export { designToSkin } from "@/studio/designDocument";
export {
  createDefaultEditorState,
  type ThemeEditorState,
} from "@/studio/themeEditorState";
export {
  applyColorPresetToState,
  applyThemeModeToState,
  COLOR_PRESET_DEFINITIONS,
  colorPresetSlice,
  type ColorPresetDefinition,
  type ColorPresetKey,
  type ColorPresetSlice,
} from "@/studio/colorPresets";
export {
  applyThemePresetToState,
  FONT_PRESETS,
  LAYOUT_PRESETS,
  MONO_FONT_PRESETS,
  THEME_PRESETS,
  THEME_PRESET_LIST,
  type LayoutPresetKey,
  type ThemePresetDefinition,
  type ThemePresetKey,
  type ThemePresetTokenOverrides,
  type ThemePresetTokens,
} from "@/studio/themePresets";
export {
  AMBER_DARK_COLORS,
  AMBER_LIGHT_COLORS,
  AUTUMN_DARK_COLORS,
  AUTUMN_LIGHT_COLORS,
  BERRY_DARK_COLORS,
  BERRY_LIGHT_COLORS,
  BOLD_DARK_COLORS,
  BOLD_LIGHT_COLORS,
  CHERRY_DARK_COLORS,
  CHERRY_LIGHT_COLORS,
  CONTRAST_DARK_COLORS,
  CONTRAST_LIGHT_COLORS,
  DARK_COLORS,
  DREAMLAND_DARK_COLORS,
  DREAMLAND_LIGHT_COLORS,
  EARTHY_DARK_COLORS,
  EARTHY_LIGHT_COLORS,
  EMERALD_DARK_COLORS,
  EMERALD_LIGHT_COLORS,
  HARVEST_DARK_COLORS,
  HARVEST_LIGHT_COLORS,
  LAVENDER_DARK_COLORS,
  LAVENDER_LIGHT_COLORS,
  LIGHT_COLORS,
  MYSTIC_DARK_COLORS,
  MYSTIC_LIGHT_COLORS,
  OCEAN_DARK_COLORS,
  OCEAN_LIGHT_COLORS,
  PAPRIKA_DARK_COLORS,
  PAPRIKA_LIGHT_COLORS,
  PEACH_DARK_COLORS,
  PEACH_LIGHT_COLORS,
  ROSE_DARK_COLORS,
  ROSE_LIGHT_COLORS,
  RUSTIC_DARK_COLORS,
  RUSTIC_LIGHT_COLORS,
  SAND_DARK_COLORS,
  SAND_LIGHT_COLORS,
  SLATE_DARK_COLORS,
  SLATE_LIGHT_COLORS,
  TOFFEE_DARK_COLORS,
  TOFFEE_LIGHT_COLORS,
  VIOLET_DARK_COLORS,
  VIOLET_LIGHT_COLORS,
} from "@/theme/namedPalettes";
export {
  applyThemeTokens,
  clearThemeInlineTokens,
  createDefaultThemeState,
  exportThemeCss,
  motionConfigFromThemeState,
  type ThemeColors,
  type ThemeTokenState,
} from "@/theme/themeDefaults";
export { resolveThemeTokenState, themeTokenStateToConfig } from "@/theme/themeConfig";
export { KIT_MOTION_RECIPE_META } from "@/components/core/utils/slotMotion/kitMotionRecipeMeta";
export {
  SKIN_LAYER_SLOTS,
  SKIN_MOTION_SLOTS,
  SKIN_TARGET_SLOTS,
} from "@/skins/skinLiveSlots.generated";
export {
  bindSkinRuleClasses,
  formatSkinPackage,
  parseSkinDocument,
  renderSkinPackage,
  renderSkinStylesheet,
  type SkinDocument,
  type SkinPackageFiles,
} from "@/skins/skinDocument";
