import { getMotionRecipe, registerKitMotionRecipe } from "../motionRecipeRegistry";
import { KIT_MOTION_RECIPES, type KitRecipeName, type MotionRecipe } from "../slotMotionTypes";

/**
 * Cold path for a kit recipe the mounted component did not bind.
 * Dynamic import keeps the other hosts' recipe modules out of this component's graph.
 */
const LOADERS: Record<KitRecipeName, () => Promise<MotionRecipe>> = {
  hoverLiftSecondLevel: () =>
    import("./hoverLiftSecondLevel").then((mod) => mod.hoverLiftSecondLevelRecipe),
  hoverLiftFirstLevel: () =>
    import("./hoverLiftFirstLevel").then((mod) => mod.hoverLiftFirstLevelRecipe),
  pressSqueeze: () => import("./pressSqueeze").then((mod) => mod.pressSqueezeRecipe),
  collapsibleHeight: () =>
    import("./collapsibleHeight").then((mod) => mod.collapsibleHeightRecipe),
  chevronRotate: () => import("./chevronRotate").then((mod) => mod.chevronRotateRecipe),
  portalSurfaceEnter: () =>
    import("./portalSurface").then((mod) => mod.portalSurfaceEnterRecipe),
  portalSurfaceLeave: () =>
    import("./portalSurface").then((mod) => mod.portalSurfaceLeaveRecipe),
  selectionFill: () => import("./selectionFill").then((mod) => mod.selectionFillRecipe),
  selectionMark: () => import("./selectionMark").then((mod) => mod.selectionMarkRecipe),
  modalOverlayEnter: () =>
    import("./modalSurface").then((mod) => mod.modalOverlayEnterRecipe),
  modalOverlayLeave: () =>
    import("./modalSurface").then((mod) => mod.modalOverlayLeaveRecipe),
  modalPanelEnter: () => import("./modalSurface").then((mod) => mod.modalPanelEnterRecipe),
  modalPanelLeave: () => import("./modalSurface").then((mod) => mod.modalPanelLeaveRecipe),
  drawerSlideEnter: () => import("./drawerSlide").then((mod) => mod.drawerSlideEnterRecipe),
  drawerSlideLeave: () => import("./drawerSlide").then((mod) => mod.drawerSlideLeaveRecipe),
  switchThumb: () => import("./switchThumb").then((mod) => mod.switchThumbRecipe),
  switchFill: () => import("./switchThumb").then((mod) => mod.switchFillRecipe),
  switchIconOn: () => import("./switchThumb").then((mod) => mod.switchIconOnRecipe),
  switchIconOff: () => import("./switchThumb").then((mod) => mod.switchIconOffRecipe),
  toastSurfaceEnter: () =>
    import("./toastSurface").then((mod) => mod.toastSurfaceEnterRecipe),
  toastSurfaceLeave: () =>
    import("./toastSurface").then((mod) => mod.toastSurfaceLeaveRecipe),
  contentFade: () => import("./contentFade").then((mod) => mod.contentFadeRecipe),
  searchExpand: () => import("./searchExpand").then((mod) => mod.searchExpandRecipe),
  searchIconShift: () => import("./searchExpand").then((mod) => mod.searchIconShiftRecipe),
  fileRowExit: () => import("./fileRowExit").then((mod) => mod.fileRowExitRecipe),
  progressFill: () => import("./progressFill").then((mod) => mod.progressFillRecipe),
  progressIndeterminate: () =>
    import("./progressFill").then((mod) => mod.progressIndeterminateRecipe),
  toastStackShift: () => import("./toastStackShift").then((mod) => mod.toastStackShiftRecipe),
  toastScrimFade: () => import("./toastScrimFade").then((mod) => mod.toastScrimFadeRecipe),
  tabsIndicatorMove: () =>
    import("./tabsIndicatorMove").then((mod) => mod.tabsIndicatorMoveRecipe),
  loadingDots: () => import("./loadingDots").then((mod) => mod.loadingDotsRecipe),
};

const inflight = new Map<string, Promise<MotionRecipe | undefined>>();

export function kitRecipeLoaderNames(): readonly string[] {
  return KIT_MOTION_RECIPES;
}

export function loadKitRecipe(name: string): Promise<MotionRecipe | undefined> {
  const live = getMotionRecipe(name);
  if (live) return Promise.resolve(live);
  const load = LOADERS[name as KitRecipeName];
  if (!load) return Promise.resolve(undefined);
  let pending = inflight.get(name);
  if (!pending) {
    pending = load().then((recipe) => {
      registerKitMotionRecipe(name as KitRecipeName, recipe);
      return getMotionRecipe(name) ?? recipe;
    });
    inflight.set(name, pending);
  }
  return pending;
}
