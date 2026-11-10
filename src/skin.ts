/**
 * Stable API for skin authors (`burne-ui/skin`).
 * App code imports components from `burne-ui`. `burne-ui/internal` stays the
 * devtools hatch; skins do not depend on it.
 */
export { killMotion } from "@/components/core/utils/gsapMotion";
export {
  getMotionConfig,
  motionPressSqueezeTotalFor,
} from "@/components/core/utils/motionConfig";
export {
  resolveAdaptiveHoverLiftScale,
  resolveAdaptivePressSqueezeScale,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
export {
  playShadowFade,
  removeShadowFadeHost,
  snapShadowFade,
} from "@/components/core/utils/shadowFade";
export { defineSkin, defineSkinRecipe, skinRecipeName } from "@/skins/defineSkin";
export type { SkinDefinition } from "@/skins/skinTypes";
export { registerSkinSlots } from "@/skins/skinSlotRegistry";
export {
  getSkinRevision,
  subscribeSkins,
} from "@/skins/skinRegistry";
export {
  mergeSkinSurfaceStyle,
  useSkinRegistryRevision,
} from "@/skins/skinContext";

/**
 * Third-party skin slots. Augment this module, then call `registerSkinSlots`
 * so the parser, `warnSkinSlots`, and `burne-ui skin validate --slot` agree.
 *
 * declare module "burne-ui/skin" {
 *   interface SkinSlotRegistry {
 *     "pricing.root": true;
 *   }
 * }
 *
 * A name that was not registered stays an unknown slot.
 */
// Empty on purpose: a consumer fills it with `declare module "burne-ui/skin"`.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmentation target, not a value type
export interface SkinSlotRegistry {}
