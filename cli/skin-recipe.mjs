/**
 * Recipe names a skin may put in `motion`.
 * Kit names are the same list as `KIT_MOTION_RECIPES`.
 * A skin recipe is `name:local` (`gloss:hover`).
 */

export const KIT_MOTION_RECIPE_NAMES = [
  "hoverLiftSecondLevel",
  "hoverLiftFirstLevel",
  "pressSqueeze",
  "collapsibleHeight",
  "chevronRotate",
  "portalSurfaceEnter",
  "portalSurfaceLeave",
  "selectionFill",
  "selectionMark",
  "modalOverlayEnter",
  "modalOverlayLeave",
  "modalPanelEnter",
  "modalPanelLeave",
  "drawerSlideEnter",
  "drawerSlideLeave",
  "switchThumb",
  "switchFill",
  "switchIconOn",
  "switchIconOff",
  "toastSurfaceEnter",
  "toastSurfaceLeave",
  "contentFade",
  "searchExpand",
  "searchIconShift",
  "fileRowExit",
  "progressFill",
  "progressIndeterminate",
  "toastStackShift",
  "toastScrimFade",
  "tabsIndicatorMove",
  "loadingDots",
];

const KIT_RECIPE_SET = new Set(KIT_MOTION_RECIPE_NAMES);

/**
 * @param {string} skinName
 * @param {unknown} recipe
 * @returns {string | null}
 */
const MOTION_VAR_KEYS = new Set([
  "x",
  "y",
  "scale",
  "scaleX",
  "scaleY",
  "rotation",
  "opacity",
  "autoAlpha",
  "duration",
  "ease",
  "yoyo",
  "repeat",
  "delay",
  "replay",
  "firstPaint",
  "recipe",
  "params",
]);

export function skinMotionRecipeError(skinName, recipe) {
  if (recipe === false) return null;
  if (recipe && typeof recipe === "object" && !Array.isArray(recipe)) {
    for (const key of Object.keys(recipe)) {
      if (/^(?:width|height|top|left|margin)/.test(key)) return `layout key ${key} is not a public var`;
      if (!MOTION_VAR_KEYS.has(key)) return `unknown motion key ${key}`;
    }
    if (recipe.recipe == null) return null;
    return skinMotionRecipeError(skinName, recipe.recipe);
  }
  if (typeof recipe !== "string" || recipe.length === 0) return "must be a recipe name";
  if (KIT_RECIPE_SET.has(recipe)) return null;
  const prefix = `${skinName}:`;
  const local = recipe.startsWith(prefix) ? recipe.slice(prefix.length) : "";
  if (local.length > 0 && /^[a-z0-9-]+$/.test(local)) return null;
  return `recipe ${recipe} must be a kit recipe or start with ${prefix}`;
}
