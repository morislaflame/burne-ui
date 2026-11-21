/**
 * Escape hatch for burne-ui internals (devtools, theme editors, kit authors).
 * App code should import from `burne-ui`, not `burne-ui/internal`.
 */
 
export {
  CONTROL_SIZE_LAYOUT,
  type ControlSizeLayout,
} from "@/components/core/utils/sizeLayout";
export { readControlHeightPx } from "@/components/core/utils/controlHeightMeasure";
export {
  affixSlotClass,
  affixToggleMinWClass,
} from "@/components/core/utils/inputAffixLayout";
export {
  buttonRootClass,
  buttonSpinnerClass,
  controlShellClass,
  buttonRippleTone,
} from "@/components/core/Button/buttonStyles";
export {
  buttonGroupRoundingClasses,
  buttonGroupOverlapBorderClasses,
  buttonGroupSegmentSurfaceClasses,
  buttonGroupTextSurfaceClasses,
  buttonGroupTextFrameClass,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
 
export { useConvergeRipples } from "@/components/core/utils/useConvergeRipples";
export { ConvergeRippleLayer } from "@/components/core/utils/pressRipple";
export {
  createConvergeRippleAtPointer,
  createConvergeRippleFromPointer,
  type ConvergeRipple,
} from "@/components/core/utils/convergeRippleGeometry";
export {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  isInteractivePressKey,
  initElementShadow,
  readShadowSize,
  readShadowVar,
  shadowCssVar,
  shadowLarge,
  shadowLift,
  shadowMid,
  shadowNone,
  shadowSmall,
  shadowBase,
  shouldSkipInteractiveHoverLift,
  useInteractiveHoverLiftContainerHandlers,
  type AnimateInteractivePressSqueezeOptions,
  type HoverShadowConfig,
} from "@/components/core/utils/hoverInteractiveLift";
export {
  useContainerPointerHoverHandlers,
  type UseContainerPointerHoverHandlersOptions,
} from "@/components/core/utils/useContainerPointerHoverHandlers";
export {
  prefersReducedMotion,
  usePrefersReducedMotion,
} from "@/components/core/utils/reducedMotion";
export {
  FIELD_SHELL_FOCUS_CLASS,
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellHoverClass,
  useFieldShellHoverLift,
  type FieldShellStatus,
} from "@/components/core/utils/useFieldShellHoverLift";
export {
  SHADOW_LIFT_MOTION_CLASS,
  shadowMotionFor,
  usePersistentElShadow,
  useSecondLevelShadow,
  useSecondLevelShadowContainer,
} from "@/components/core/utils/useShadowMotion";
export { gsap, killMotion, tweenCssColor, resolveCssColor, ensureRippleEase } from "@/components/core/utils/gsapMotion";
export {
  getMotionConfig,
  MOTION_CONFIG_DEFAULTS,
  MOTION_CONFIG_LIMITS,
  MOTION_CSS_VAR,
  applyMotionCssTokens,
  motionPressSqueezeTotalFor,
  overlayMotionConfig,
} from "@/components/core/utils/motionConfig";
export {
  resolveAdaptiveHoverLiftScale,
  resolveAdaptivePressSqueezeScale,
} from "@/components/core/utils/hoverInteractiveLift";
export {
  playShadowFade,
  removeShadowFadeHost,
  snapShadowFade,
  type ShadowFadeKind,
  type ShadowFadeName,
} from "@/components/core/utils/shadowFade";
export type { TweenCssColorOptions } from "@/components/core/utils/gsapMotion";
export {
  hasMotionRecipe,
  isKitMotionRecipe,
  isMotionRunActive,
  KIT_MOTION_RECIPE_META,
  listMotionRecipes,
  MOTION_RECIPE_METADATA_DEFAULTS,
  unregisterMotionRecipe,
  type MotionBroadcastOptions,
  type MotionCancelReason,
  type MotionRun,
} from "@/components/core/utils/slotMotion";
export type {
  MotionRecipeParams,
  MotionTransformVars,
} from "@/components/core/utils/slotMotion";
export {
  SHADOW_INTERACTION_GEOM,
  SHADOW_KNOB_CSS_DEFAULTS,
  SHADOW_LIFT_CSS_VAR,
  SHADOW_OPACITY_BASE,
} from "@/tokens/shadows";
 
export {
  applyThemeTokens,
  clearThemeInlineTokens,
  createDefaultThemeState,
  ensureModePalettes,
  activateThemeModePalette,
  patchThemeColor,
  exportThemeCss,
  fluidScaleRem,
  resolveBorderTokenCss,
  OUTLINE_BORDER_WIDTH_MIN_PX,
  COLOR_CSS_VAR,
  DEFAULT_FONT,
  DEFAULT_FONT_MONO,
  FONT_WEIGHT_CSS_VAR,
  FONT_WEIGHT_DEFAULTS,
  MOTION_DEFAULTS,
  SCALE_DEFAULTS,
  TEXT_SCALE_BASES,
  motionConfigFromThemeState,
  type ThemeColorKey,
  type ThemeColors,
  type ThemeDerivedColorKey,
  type ThemeFontWeightKey,
  type ThemeFontWeights,
  type ThemeMode,
  type ThemeStatusForegroundKey,
  type ThemeStatusForegrounds,
  type ThemeTokenState,
  type ResolvedBorderTokenCss,
  DARK_COLORS,
  LIGHT_COLORS,
  applyBurneThemeConfig,
  applyCustomThemeTokens,
  applyTokens,
  clearCustomThemeTokens,
  exportBurneThemeConfigSource,
  exportBurneThemeCss,
  mergeThemeTokenOverrides,
  resolveTheme,
  resolveCustomThemeTokens,
  resolveThemeTokenState,
  createDefaultBurneThemeConfig,
  exportDefaultBurneThemeConfigSource,
  themeTokenStateToConfig,
  applyThemeMode,
  useBurneThemeRuntime,
  useBurneThemeRuntimeOptional,
  type BurneThemeRuntimeContextValue,
  type ThemeModeColorOverrides,
  type ThemeTokenOverrides,
  type CustomThemeTokenControl,
  type CustomThemeTokenDefinition,
  type CustomThemeTokens,
  type CustomThemeTokenValue,
  type BurneThemeConfig,
  type BurneThemeMode,
} from "@/theme";

export {
  SKIN_FORBIDDEN_TOKENS,
  SKIN_LAYER_SLOTS,
  SKIN_MOTION_SLOTS,
  SKIN_SLOTS,
  SKIN_TARGET_SLOTS,
  isForbiddenSkinToken,
  type SkinForbiddenToken,
  type SkinLayerSlot,
  type SkinMotionSlot,
  type SkinTargetSlot,
} from "@/skins/skinTypes";
export {
  resolveSkinTokens,
  applySkinVars,
  releaseSkinVars,
  captureBaseline,
  baselineFor,
  skinSurfaceStyle,
  isPaletteSkinToken,
  type SkinTokenMap,
} from "@/skins/resolveSkinTokens";
export {
  parseSkinDocument,
  renderSkinPackage,
  renderSkinStylesheet,
  skinExportName,
  skinToJson,
  shadowLayerCount,
  SKIN_DOCUMENT_SCHEMA,
  SKIN_EDITOR_EXAMPLE,
  type SkinDocument,
  type SkinParseResult,
} from "@/skins/skinDocument";

export {
  resolveAlertLiveRole,
} from "@/components/core/Alert/alertA11y";
export {
  resolveAlertStatus,
  resolveAlertVariant,
} from "@/components/core/Alert/alertAPI";
export {
  primaryButtonStatusForAlertTone,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog/alertDialogAPI";
export { footerButtonSizeForAlertDialog } from "@/components/composite/AlertDialog/alertDialogStyles";
export { sliderThicknessToCss } from "@/components/core/Slider/sliderStyles";
export { TABLE_ROW_TONE_SURFACE } from "@/components/core/Table/tableStyles";
export {
  SELECTION_INDICATOR_FILL_CLASS,
  SELECTION_INDICATOR_ICON_CLASS,
  SELECTION_INDICATOR_RADIUS_CLASS,
  SELECTION_INDICATOR_SHELL_CLASS,
  SELECTION_INDICATOR_SIZE_CLASS,
  selectionIndicatorFallbackPx,
  selectionIndicatorShellClass,
  selectionIndicatorVariantClass,
} from "@/components/core/SelectionIndicator/selectionIndicatorStyles";
export {
  SELECTION_INDICATOR_FILL_DISPLAY_NAME,
  SELECTION_INDICATOR_MARK_DISPLAY_NAME,
} from "@/components/core/SelectionIndicator/selectionIndicatorAPI";
export { useSelectionIndicatorAnimation } from "@/components/core/SelectionIndicator/selectionIndicatorAnimations";
export {
  hexToHsva,
  hexToRgba,
  hsvaToColorString,
  hsvaToHex,
  hsvaToRgba,
  hueToRgbString,
  rgbaToHex,
  rgbaToHsva,
} from "@/components/core/ColorPicker/colorUtils";
export { RIPPLE_COLOR } from "@/components/core/Ripple/rippleTokens";
export {
  HOVER_CARD_CLOSE_DELAY,
  HOVER_CARD_OPEN_DELAY,
} from "@/components/core/HoverCard/hoverCardTypes";
export { ToastContext, useToastContext } from "@/components/core/Toast/toastContext";
export { isMotionFeatureEnabledFor } from "@/components/core/utils/motionConfig";
export { KIT_MOTION_RECIPES } from "@/components/core/utils/slotMotion/slotMotionTypes";
export {
  NARROW_VIEWPORT_MAX_PX,
  SHADOW_CSS_VAR,
  TOUCH_OR_NARROW_VIEWPORT_MQL,
  TOUCH_OR_NARROW_VIEWPORT_MQL_ANY_POINTER,
  Z_INDEX_CSS_VAR,
  Z_INDEX_DEFAULTS,
} from "@/tokens";
 