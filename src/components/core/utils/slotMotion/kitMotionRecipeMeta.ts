import {
  KIT_MOTION_RECIPES,
  type KitRecipeName,
  type MotionPhaseName,
  type MotionRecipeMetadata,
} from "./slotMotionTypes";

type RecipePassport = Omit<MotionRecipeMetadata, "label" | "phases" | "parameters">;
 
const pointer: RecipePassport = {
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "skip",
  usesLayout: false,
  supportsLeaveCompletion: false,
  interactive: true,
  defaultDurationToken: "interactiveDuration",
};
 
const overlayEnter = (token: RecipePassport["defaultDurationToken"]): RecipePassport => ({
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "instant",
  usesLayout: false,
  supportsLeaveCompletion: false,
  interactive: false,
  defaultDurationToken: token,
});
 
const overlayLeave = (token: RecipePassport["defaultDurationToken"]): RecipePassport => ({
  hidesFirstPaint: false,
  supportsReducedMotion: true,
  reducedStrategy: "instant",
  usesLayout: false,
  supportsLeaveCompletion: true,
  interactive: false,
  defaultDurationToken: token,
});
 
const checkInstant = (token: RecipePassport["defaultDurationToken"]): RecipePassport => ({
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
const KIT_MOTION_RECIPE_PASSPORTS: Record<
  KitRecipeName,
  Omit<MotionRecipeMetadata, "label" | "phases" | "parameters">
> = {
  hoverLiftSecondLevel: pointer,
  hoverLiftFirstLevel: pointer,
  pressSqueeze: pointer,
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
  toastStackShift: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: false,
    interactive: false,
    defaultDurationToken: "interactiveDuration",
  },
  toastScrimFade: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: true,
    interactive: false,
    defaultDurationToken: "interactiveDuration",
  },
  tabsIndicatorMove: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: false,
    interactive: false,
    defaultDurationToken: "interactiveDuration",
  },
  /** Cycle (`repeat: -1`). Host replays `enter` when config or reduced motion changes. */
  loadingDots: {
    hidesFirstPaint: false,
    supportsReducedMotion: true,
    reducedStrategy: "instant",
    usesLayout: false,
    supportsLeaveCompletion: false,
    interactive: false,
    defaultDurationToken: "loadingDotsDuration",
  },
};
 
const KIT_RECIPE_LABEL: Record<KitRecipeName, { ru: string; en: string }> = {
  hoverLiftSecondLevel: { ru: "Тень второго уровня", en: "Second-level hover shadow" },
  hoverLiftFirstLevel: { ru: "Тень первого уровня", en: "First-level hover shadow" },
  pressSqueeze: { ru: "Сжатие при нажатии", en: "Press squeeze" },
  collapsibleHeight: { ru: "Высота панели", en: "Collapsible height" },
  chevronRotate: { ru: "Поворот шеврона", en: "Chevron rotate" },
  portalSurfaceEnter: { ru: "Вход портала", en: "Portal surface enter" },
  portalSurfaceLeave: { ru: "Уход портала", en: "Portal surface leave" },
  selectionFill: { ru: "Заливка выбора", en: "Selection fill" },
  selectionMark: { ru: "Отметка выбора", en: "Selection mark" },
  modalOverlayEnter: { ru: "Вход подложки", en: "Modal overlay enter" },
  modalOverlayLeave: { ru: "Уход подложки", en: "Modal overlay leave" },
  modalPanelEnter: { ru: "Вход модальной панели", en: "Modal panel enter" },
  modalPanelLeave: { ru: "Уход модальной панели", en: "Modal panel leave" },
  drawerSlideEnter: { ru: "Вход выдвижной панели", en: "Drawer slide enter" },
  drawerSlideLeave: { ru: "Уход выдвижной панели", en: "Drawer slide leave" },
  switchThumb: { ru: "Бегунок переключателя", en: "Switch thumb" },
  switchFill: { ru: "Заливка переключателя", en: "Switch fill" },
  switchIconOn: { ru: "Иконка включено", en: "Switch icon on" },
  switchIconOff: { ru: "Иконка выключено", en: "Switch icon off" },
  toastSurfaceEnter: { ru: "Вход тоста", en: "Toast surface enter" },
  toastSurfaceLeave: { ru: "Уход тоста", en: "Toast surface leave" },
  contentFade: { ru: "Появление контента", en: "Content fade" },
  searchExpand: { ru: "Раскрытие поиска", en: "Search expand" },
  searchIconShift: { ru: "Сдвиг иконки поиска", en: "Search icon shift" },
  fileRowExit: { ru: "Уход строки файла", en: "File row exit" },
  progressFill: { ru: "Заливка прогресса", en: "Progress fill" },
  progressIndeterminate: { ru: "Неопределённый прогресс", en: "Indeterminate progress" },
  toastStackShift: { ru: "Сдвиг стека тостов", en: "Toast stack shift" },
  toastScrimFade: { ru: "Затемнение тоста", en: "Toast scrim fade" },
  tabsIndicatorMove: { ru: "Индикатор вкладок", en: "Tabs indicator" },
  loadingDots: { ru: "Точки загрузки", en: "Loading dots" },
};

/**
 * Phases each kit recipe is assigned in `*_MOTION_DEFAULTS`.
 * `progressFill.enter` is opt-in: `useBarFillMotion` plays it when the host sets `fill.enter`.
 */
const KIT_RECIPE_PHASES: Record<KitRecipeName, readonly MotionPhaseName[]> = {
  hoverLiftSecondLevel: ["hoverIn", "hoverOut"],
  hoverLiftFirstLevel: ["hoverIn", "hoverOut"],
  pressSqueeze: ["pressIn"],
  collapsibleHeight: ["enter", "leave"],
  chevronRotate: ["enter", "leave"],
  portalSurfaceEnter: ["enter"],
  portalSurfaceLeave: ["leave"],
  selectionFill: ["check", "uncheck"],
  selectionMark: ["check", "uncheck"],
  modalOverlayEnter: ["enter"],
  modalOverlayLeave: ["leave"],
  modalPanelEnter: ["enter"],
  modalPanelLeave: ["leave"],
  drawerSlideEnter: ["enter"],
  drawerSlideLeave: ["leave"],
  switchThumb: ["check", "uncheck"],
  switchFill: ["check", "uncheck"],
  switchIconOn: ["check", "uncheck"],
  switchIconOff: ["check", "uncheck"],
  toastSurfaceEnter: ["enter"],
  toastSurfaceLeave: ["leave"],
  contentFade: ["enter", "leave"],
  searchExpand: ["enter", "leave"],
  searchIconShift: ["enter", "leave"],
  fileRowExit: ["leave"],
  progressFill: ["enter", "change"],
  progressIndeterminate: ["change"],
  toastStackShift: ["enter", "change"],
  toastScrimFade: ["enter", "leave"],
  tabsIndicatorMove: ["change"],
  loadingDots: ["enter"],
};

export const KIT_MOTION_RECIPE_META: Record<KitRecipeName, MotionRecipeMetadata> = Object.fromEntries(
  (Object.keys(KIT_MOTION_RECIPE_PASSPORTS) as KitRecipeName[]).map((name) => {
    const meta = KIT_MOTION_RECIPE_PASSPORTS[name];
    return [name, {
      ...meta,
      label: KIT_RECIPE_LABEL[name],
      phases: KIT_RECIPE_PHASES[name],
      parameters: [{
        key: meta.defaultDurationToken,
        label: { ru: "Длительность", en: "Duration" },
        type: "number" as const,
        unit: "ms" as const,
        min: 0,
        max: name === "progressIndeterminate" || name === "loadingDots" ? 4000 : 2000,
      }],
    }];
  }),
) as unknown as Record<KitRecipeName, MotionRecipeMetadata>;

/** Kit names whose nested enter must hide first paint (`contentFade`). Prefer live `getMotionRecipeMetadata`. */
export const KIT_ENTER_HIDES_FIRST_PAINT: ReadonlySet<string> = new Set(
  KIT_MOTION_RECIPES.filter((name) => KIT_MOTION_RECIPE_META[name].hidesFirstPaint));
 
