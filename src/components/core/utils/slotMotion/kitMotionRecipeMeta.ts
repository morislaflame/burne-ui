import {
  KIT_MOTION_RECIPES,
  type KitRecipeName,
  type MotionRecipeMetadata,
} from "./slotMotionTypes";

const pointer: MotionRecipeMetadata = {
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "skip",
  usesLayout: false,
  supportsLeaveCompletion: false,
  interactive: true,
  defaultDurationToken: "interactiveDuration",
};

const overlayEnter = (token: MotionRecipeMetadata["defaultDurationToken"]): MotionRecipeMetadata => ({
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "instant",
  usesLayout: false,
  supportsLeaveCompletion: false,
  interactive: false,
  defaultDurationToken: token,
});

const overlayLeave = (token: MotionRecipeMetadata["defaultDurationToken"]): MotionRecipeMetadata => ({
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "instant",
  usesLayout: false,
  supportsLeaveCompletion: true,
  interactive: false,
  defaultDurationToken: token,
});

const checkInstant = (token: MotionRecipeMetadata["defaultDurationToken"]): MotionRecipeMetadata => ({
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "instant",
  usesLayout: false,
  supportsLeaveCompletion: false,
  interactive: false,
  defaultDurationToken: token,
});

/**
 * Kit recipe passport. Single source for first-paint hide, layout, leave, and duration token.
 * `registerKitMotionRecipe` reads this table — do not duplicate flags in `enterHidesFirstPaint`.
 */
export const KIT_MOTION_RECIPE_META: Record<KitRecipeName, MotionRecipeMetadata> = {
  hoverLiftSecondLevel: pointer,
  hoverLiftGloss: pointer,
  hoverLiftFirstLevel: pointer,
  pressSqueeze: pointer,
  pressSqueezeGloss: pointer,
  collapsibleHeight: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: true,
    supportsLeaveCompletion: true,
    interactive: false,
    defaultDurationToken: "expandDuration",
  },
  chevronRotate: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: false,
    interactive: false,
    defaultDurationToken: "expandDuration",
  },
  portalSurfaceEnter: overlayEnter("tooltipDuration"),
  portalSurfaceLeave: overlayLeave("tooltipDuration"),
  selectionFill: checkInstant("selectionFillDuration"),
  selectionMark: checkInstant("selectionFillDuration"),
  modalOverlayEnter: overlayEnter("modalDuration"),
  modalOverlayLeave: overlayLeave("modalDuration"),
  modalPanelEnter: overlayEnter("modalDuration"),
  modalPanelLeave: overlayLeave("modalDuration"),
  drawerSlideEnter: overlayEnter("modalDuration"),
  drawerSlideLeave: overlayLeave("modalDuration"),
  switchThumb: checkInstant("switchThumbDuration"),
  switchFill: checkInstant("interactiveDuration"),
  switchIconOn: checkInstant("interactiveDuration"),
  switchIconOff: checkInstant("interactiveDuration"),
  toastSurfaceEnter: overlayEnter("interactiveDuration"),
  toastSurfaceLeave: overlayLeave("toastDismissDuration"),
  contentFade: {
    hidesFirstPaint: true,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: true,
    interactive: false,
    defaultDurationToken: "tooltipDuration",
  },
  searchExpand: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: true,
    supportsLeaveCompletion: true,
    interactive: false,
    defaultDurationToken: "interactiveDuration",
  },
  searchIconShift: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: true,
    supportsLeaveCompletion: true,
    interactive: false,
    defaultDurationToken: "interactiveDuration",
  },
  fileRowExit: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: true,
    interactive: false,
    defaultDurationToken: "interactiveDuration",
  },
  progressFill: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: false,
    interactive: false,
    defaultDurationToken: "progressFillDuration",
  },
  progressIndeterminate: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: true,
    supportsLeaveCompletion: false,
    interactive: false,
    defaultDurationToken: "progressIndeterminateDuration",
  },
};

/** Kit names whose nested enter must hide first paint (`contentFade`). Prefer live `getMotionRecipeMetadata`. */
export const KIT_ENTER_HIDES_FIRST_PAINT: ReadonlySet<string> = new Set(
  KIT_MOTION_RECIPES.filter((name) => KIT_MOTION_RECIPE_META[name].hidesFirstPaint),
);
