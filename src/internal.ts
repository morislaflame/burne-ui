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
  buildTokenBoxShadow,
  isInteractivePressKey,
  initElementShadow,
  readShadowSize,
  readShadowVar,
  resolveConcreteBoxShadow,
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
  firstLevelHoverShadow,
  secondLevelShadow,
  shadowMotionFor,
  usePersistentElShadow,
  useSecondLevelShadow,
  useSecondLevelShadowContainer,
} from "@/components/core/utils/useShadowMotion";
export { gsap, killMotion, tweenCssColor, resolveCssColor, ensureRippleEase } from "@/components/core/utils/gsapMotion";
export {
  MOTION_CONFIG_DEFAULTS,
  MOTION_CONFIG_LIMITS,
  MOTION_CSS_VAR,
  applyMotionCssTokens,
  overlayMotionConfig,
} from "@/components/core/utils/motionConfig";
export type {
  MotionRecipeParams,
  MotionTransformVars,
} from "@/components/core/utils/slotMotion";
export {
  SHADOW_INTERACTION_GEOM,
  SHADOW_KNOB_CSS_DEFAULTS,
  SHADOW_LAYER_GEOM,
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
