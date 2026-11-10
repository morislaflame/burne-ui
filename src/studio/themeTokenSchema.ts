import { MOTION_CONFIG_LIMITS } from "@/components/core/utils/motionConfigValidation";
import { COLOR_CSS_VAR, type ThemeColorKey } from "@/theme/themeDefaults";

export type ThemeTokenControlType =
  | "color"
  | "length"
  | "shadow"
  | "ease"
  | "duration"
  | "flag"
  | "number"
  | "font";

export type ThemeTokenSchemaEntry = {
  key: string;
  group: string;
  label: { ru: string; en: string };
  type: ThemeTokenControlType;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
};

type Knob = {
  key: string;
  group: string;
  ru: string;
  en: string;
  type: ThemeTokenControlType;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
};

/** Slider range for the studio. The hard clamp stays `MOTION_CONFIG_LIMITS.durationMs` (0–60 000). */
const duration = { min: 0, max: 2000 };
const longDuration = { min: 0, max: 4000 };
const scale = MOTION_CONFIG_LIMITS.scale;
const squeeze = MOTION_CONFIG_LIMITS.pressSqueezeScale;
const factor = MOTION_CONFIG_LIMITS.factor;
const opacity = MOTION_CONFIG_LIMITS.opacity;

const KNOBS: readonly Knob[] = [
  { key: "space", group: "space", ru: "Плотность", en: "Spacing", type: "length", unit: "rem", min: 0.3, max: 0.8, step: 0.025 },
  { key: "size", group: "space", ru: "Размер контрола", en: "Control size", type: "length", unit: "rem", min: 0.8, max: 1.25, step: 0.025 },
  { key: "radius", group: "space", ru: "Радиус", en: "Radius", type: "length", unit: "rem", min: 0, max: 1.5, step: 0.025 },
  { key: "borderWidth", group: "space", ru: "Толщина рамки", en: "Border width", type: "length", unit: "px", min: 0, max: 2, step: 0.5 },
  { key: "focusRingWidth", group: "focus", ru: "Толщина кольца", en: "Focus ring width", type: "length", unit: "px", min: 0.5, max: 3, step: 0.5 },
  { key: "focusRingOffset", group: "focus", ru: "Отступ кольца", en: "Focus ring offset", type: "length", unit: "px", min: 0, max: 6, step: 1 },
  { key: "textScale", group: "type", ru: "Шкала текста", en: "Type scale", type: "number", unit: "×", min: 0.95, max: 1.15, step: 0.025 },
  { key: "letterSpacing", group: "type", ru: "Трекинг", en: "Letter spacing", type: "length", unit: "em", min: -0.05, max: 0.12, step: 0.005 },
  { key: "fontFamily", group: "type", ru: "Шрифт", en: "Font", type: "font" },
  { key: "fontFamilyMono", group: "type", ru: "Моноширинный", en: "Monospace", type: "font" },
  { key: "shadowOpacity", group: "shadow", ru: "Прозрачность тени", en: "Shadow opacity", type: "shadow", unit: "×", min: 0, max: 2, step: 0.05 },
  { key: "shadowBlur", group: "shadow", ru: "Размытие тени", en: "Shadow blur", type: "shadow", unit: "×", min: 0, max: 3, step: 0.05 },
  { key: "shadowSpread", group: "shadow", ru: "Разброс тени", en: "Shadow spread", type: "shadow", unit: "×", min: 0, max: 3, step: 0.05 },
  { key: "shadowOffsetX", group: "shadow", ru: "Сдвиг тени по X", en: "Shadow offset X", type: "shadow", unit: "px", min: -24, max: 24, step: 1 },
  { key: "shadowOffsetY", group: "shadow", ru: "Сдвиг тени по Y", en: "Shadow offset Y", type: "shadow", unit: "px", min: -24, max: 24, step: 1 },
  { key: "toastScrimSize", group: "shadow", ru: "Размер подложки тоста", en: "Toast scrim size", type: "shadow", unit: "×", min: 0.5, max: 2, step: 0.05 },
  { key: "toastScrimDensity", group: "shadow", ru: "Плотность подложки тоста", en: "Toast scrim density", type: "shadow", unit: "×", min: 0, max: 2, step: 0.05 },
  { key: "interactiveDuration", group: "motion", ru: "Интерактив", en: "Interactive duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "modalDuration", group: "motion", ru: "Модалка", en: "Modal duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "tooltipDuration", group: "motion", ru: "Подсказка", en: "Tooltip duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "switchThumbDuration", group: "motion", ru: "Бегунок свитча", en: "Switch thumb duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "selectionFillDuration", group: "motion", ru: "Заливка выбора", en: "Selection fill duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "expandDuration", group: "motion", ru: "Раскрытие", en: "Expand duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "surfaceTransitionDuration", group: "motion", ru: "Поверхность", en: "Surface transition", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "toastDismissDuration", group: "motion", ru: "Закрытие тоста", en: "Toast dismiss", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "rippleDefaultDuration", group: "motion", ru: "Рябь", en: "Ripple duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "rippleExpandableDuration", group: "motion", ru: "Рябь раскрытия", en: "Expandable ripple duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "progressFillDuration", group: "motion", ru: "Заполнение прогресса", en: "Progress fill duration", type: "duration", unit: "ms", min: duration.min, max: duration.max, step: 10 },
  { key: "progressIndeterminateDuration", group: "motion", ru: "Неопределённый прогресс", en: "Progress indeterminate duration", type: "duration", unit: "ms", min: longDuration.min, max: longDuration.max, step: 50 },
  { key: "loadingDotsDuration", group: "motion", ru: "Точки загрузки", en: "Loading dots duration", type: "duration", unit: "ms", min: longDuration.min, max: longDuration.max, step: 50 },
  { key: "interactiveEase", group: "motion", ru: "Ease интерактива", en: "Interactive easing", type: "ease" },
  { key: "hoverLiftEase", group: "motion", ru: "Ease подъёма", en: "Hover lift easing", type: "ease" },
  { key: "switchThumbEase", group: "motion", ru: "Ease бегунка", en: "Switch thumb easing", type: "ease" },
  { key: "selectionFillEase", group: "motion", ru: "Ease заливки", en: "Selection fill easing", type: "ease" },
  { key: "expandOpenEase", group: "motion", ru: "Ease раскрытия", en: "Expand easing", type: "ease" },
  { key: "toastDismissEase", group: "motion", ru: "Ease закрытия тоста", en: "Toast dismiss easing", type: "ease" },
  { key: "progressFillEase", group: "motion", ru: "Ease прогресса", en: "Progress fill easing", type: "ease" },
  { key: "progressIndeterminateEase", group: "motion", ru: "Ease неопределённого прогресса", en: "Progress indeterminate easing", type: "ease" },
  { key: "loadingDotsEaseUp", group: "motion", ru: "Ease точек вверх", en: "Loading dots up", type: "ease" },
  { key: "loadingDotsEaseDown", group: "motion", ru: "Ease точек вниз", en: "Loading dots down", type: "ease" },
  { key: "rippleEaseCss", group: "motion", ru: "CSS-ease ряби", en: "Ripple CSS easing", type: "ease" },
  { key: "hoverLiftScale", group: "motion", ru: "Масштаб подъёма", en: "Hover lift scale", type: "number", min: scale.min, max: scale.max, step: 0.005 },
  { key: "badgeAnchorHoverLiftScale", group: "motion", ru: "Масштаб бейджа", en: "Badge anchor scale", type: "number", min: scale.min, max: scale.max, step: 0.005 },
  { key: "pressSqueezeMid", group: "motion", ru: "Сжатие нажатия", en: "Press squeeze", type: "number", min: squeeze.min, max: squeeze.max, step: 0.005 },
  { key: "pressSqueezeDurationFactor", group: "motion", ru: "Длительность нажатия", en: "Press duration factor", type: "number", min: factor.min, max: factor.max, step: 0.05 },
  { key: "rippleDefaultOpacityFrom", group: "motion", ru: "Прозрачность ряби", en: "Ripple opacity", type: "number", min: opacity.min, max: opacity.max, step: 0.01 },
  { key: "rippleExpandableOpacityFrom", group: "motion", ru: "Прозрачность ряби раскрытия", en: "Expandable ripple opacity", type: "number", min: opacity.min, max: opacity.max, step: 0.01 },
  { key: "enableAnimations", group: "motion", ru: "Все анимации", en: "All animations", type: "flag" },
  { key: "enableHoverLift", group: "motion", ru: "Подъём", en: "Hover lift", type: "flag" },
  { key: "enablePressSqueeze", group: "motion", ru: "Нажатие", en: "Press squeeze", type: "flag" },
  { key: "enableToggleButtonFill", group: "motion", ru: "Заливка тоггла", en: "Toggle fill", type: "flag" },
  { key: "enableRipple", group: "motion", ru: "Рябь", en: "Ripple", type: "flag" },
  { key: "enableExpandable", group: "motion", ru: "Раскрытие", en: "Expandable", type: "flag" },
  { key: "enableToastStack", group: "motion", ru: "Стопка тостов", en: "Toast stack", type: "flag" },
  { key: "enableContentFade", group: "motion", ru: "Появление контента", en: "Content fade", type: "flag" },
  { key: "enableProgressFill", group: "motion", ru: "Заполнение прогресса", en: "Progress fill", type: "flag" },
  { key: "enableLoadingDots", group: "motion", ru: "Точки загрузки", en: "Loading dots", type: "flag" },
  { key: "enableModalMotion", group: "motion", ru: "Модалка", en: "Modal motion", type: "flag" },
  { key: "enableSwitchThumb", group: "motion", ru: "Бегунок свитча", en: "Switch thumb", type: "flag" },
  { key: "enableTabsIndicator", group: "motion", ru: "Индикатор вкладок", en: "Tabs indicator", type: "flag" },
  { key: "enablePaginationFlip", group: "motion", ru: "FLIP пагинации", en: "Pagination FLIP", type: "flag" },
  { key: "enableSelectionFill", group: "motion", ru: "Заливка выбора", en: "Selection fill", type: "flag" },
];

const COLOR_LABELS: Record<ThemeColorKey, { ru: string; en: string }> = {
  background: { ru: "Фон", en: "Background" },
  surface: { ru: "Поверхность", en: "Surface" },
  secondary: { ru: "Вторичный", en: "Secondary" },
  secondaryForeground: { ru: "Текст вторичного", en: "Secondary foreground" },
  tertiary: { ru: "Третичный", en: "Tertiary" },
  tertiaryForeground: { ru: "Текст третичного", en: "Tertiary foreground" },
  border: { ru: "Рамка", en: "Border" },
  shadow: { ru: "Тень", en: "Shadow" },
  shadowSecondary: { ru: "Вторая тень", en: "Shadow secondary" },
  foreground: { ru: "Текст", en: "Foreground" },
  muted: { ru: "Приглушённый", en: "Muted" },
  mutedForeground: { ru: "Приглушённый текст", en: "Muted foreground" },
  primary: { ru: "Основной", en: "Primary" },
  primaryForeground: { ru: "Текст основного", en: "Primary foreground" },
  primaryTint: { ru: "Оттенок основного", en: "Primary tint" },
  primaryTintStrong: { ru: "Сильный оттенок", en: "Primary tint strong" },
  focusRing: { ru: "Кольцо фокуса", en: "Focus ring" },
  focusRingDanger: { ru: "Кольцо опасности", en: "Focus ring danger" },
  focusRingSuccess: { ru: "Кольцо успеха", en: "Focus ring success" },
  focusRingInfo: { ru: "Кольцо информации", en: "Focus ring info" },
  focusRingWarning: { ru: "Кольцо предупреждения", en: "Focus ring warning" },
  indicator: { ru: "Индикатор", en: "Indicator" },
  indicatorForeground: { ru: "Текст индикатора", en: "Indicator foreground" },
  danger: { ru: "Опасность", en: "Danger" },
  success: { ru: "Успех", en: "Success" },
  info: { ru: "Информация", en: "Info" },
  warning: { ru: "Предупреждение", en: "Warning" },
  dangerForeground: { ru: "Текст опасности", en: "Danger foreground" },
  successForeground: { ru: "Текст успеха", en: "Success foreground" },
  infoForeground: { ru: "Текст информации", en: "Info foreground" },
  warningForeground: { ru: "Текст предупреждения", en: "Warning foreground" },
  primaryHover: { ru: "Основной при наведении", en: "Primary hover" },
  defaultHover: { ru: "Наведение", en: "Default hover" },
  transparentHover: { ru: "Прозрачное наведение", en: "Transparent hover" },
  secondaryHover: { ru: "Вторичный при наведении", en: "Secondary hover" },
  tertiaryHover: { ru: "Третичный при наведении", en: "Tertiary hover" },
  surfaceTintDanger: { ru: "Подложка опасности", en: "Danger surface tint" },
  surfaceTintDangerHover: { ru: "Подложка опасности при наведении", en: "Danger surface tint hover" },
  dangerFillHover: { ru: "Заливка опасности", en: "Danger fill hover" },
  surfaceTintSuccess: { ru: "Подложка успеха", en: "Success surface tint" },
  surfaceTintSuccessHover: { ru: "Подложка успеха при наведении", en: "Success surface tint hover" },
  successFillHover: { ru: "Заливка успеха", en: "Success fill hover" },
  surfaceTintInfo: { ru: "Подложка информации", en: "Info surface tint" },
  surfaceTintInfoHover: { ru: "Подложка информации при наведении", en: "Info surface tint hover" },
  infoFillHover: { ru: "Заливка информации", en: "Info fill hover" },
  surfaceTintWarning: { ru: "Подложка предупреждения", en: "Warning surface tint" },
  surfaceTintWarningHover: { ru: "Подложка предупреждения при наведении", en: "Warning surface tint hover" },
  warningFillHover: { ru: "Заливка предупреждения", en: "Warning fill hover" },
  convergeRipplePrimaryFill: { ru: "Рябь основного", en: "Ripple primary fill" },
  convergeRippleNeutral: { ru: "Нейтральная рябь", en: "Ripple neutral" },
  convergeRippleNeutralMuted: { ru: "Приглушённая рябь", en: "Ripple neutral muted" },
  convergeRippleDanger: { ru: "Рябь опасности", en: "Ripple danger" },
  convergeRippleSuccess: { ru: "Рябь успеха", en: "Ripple success" },
  convergeRippleInfo: { ru: "Рябь информации", en: "Ripple info" },
  convergeRippleWarning: { ru: "Рябь предупреждения", en: "Ripple warning" },
};

function knobEntry(knob: Knob): ThemeTokenSchemaEntry {
  return {
    key: knob.key,
    group: knob.group,
    label: { ru: knob.ru, en: knob.en },
    type: knob.type,
    ...(knob.unit ? { unit: knob.unit } : {}),
    ...(knob.min != null ? { min: knob.min } : {}),
    ...(knob.max != null ? { max: knob.max } : {}),
    ...(knob.step != null ? { step: knob.step } : {}),
  };
}

/**
 * Every studio knob. A new key in `ThemeTokenState` is added here so the panel
 * does not keep its own copy of the list.
 */
export const THEME_TOKEN_SCHEMA: readonly ThemeTokenSchemaEntry[] = [
  ...KNOBS.map(knobEntry),
  ...(Object.keys(COLOR_CSS_VAR) as ThemeColorKey[]).map((key) => ({
    key,
    group: "color",
    label: COLOR_LABELS[key],
    type: "color" as const,
  })),
];

const SCHEMA_BY_KEY = new Map(THEME_TOKEN_SCHEMA.map((entry) => [entry.key, entry]));

export function themeTokenSchemaEntry(key: string): ThemeTokenSchemaEntry | undefined {
  return SCHEMA_BY_KEY.get(key);
}
