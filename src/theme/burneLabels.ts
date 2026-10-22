/**
 * Default accessible / UI strings used when a component does not receive an
 * explicit `aria-label` (or visible label override).
 *
 * Pass a partial override via `BurneUIProvider` `labels` / `config.labels`,
 * or wrap with `BurneLabelsProvider`. Templates use `{name}` placeholders.
 */
 
export type BurneLabels = {
  close: string;
  openSearch: string;
  search: string;
  clearField: string;
  resizeColumn: string;
  /** Template: `{name}` */
  resizeColumnNamed: string;
  resizePanels: string;
  time: string;
  timeHours: string;
  timeMinutes: string;
  timeSeconds: string;
  openList: string;
  closeList: string;
  showPassword: string;
  hidePassword: string;
  removeFile: string;
  resizeHeight: string;
  breadcrumbs: string;
  /** Template: `{count}` */
  breadcrumbsShowHidden: string;
  breadcrumbsHiddenSections: string;
  pagination: string;
  paginationPrevious: string;
  paginationNext: string;
  /** Template: `{n}` */
  paginationPage: string;
  /** Template: `{placement}` */
  toastNotifications: string;
  colorPickerArea: string;
  /** Template: `{saturation}`, `{brightness}` */
  colorPickerAreaValue: string;
  colorPickerContent: string;
  colorPickerHex: string;
  colorPickerAlpha: string;
  /** Template: `{hex}` */
  colorPickerSelected: string;
  formErrorOne: string;
  /** Template: `{count}` */
  formErrorMany: string;
  formSubmitted: string;
  sliderMinimum: string;
  sliderMaximum: string;
  sliderValue: string;
  switch: string;
  radioOption: string;
  calendarPrevious: string;
  calendarNext: string;
  listBoxEmpty: string;
  loading: string;
  /** Placeholder while a promise toast is pending. */
  loadingStatus: string;
  toastError: string;
  selectValue: string;
  selectDate: string;
  selectDateRange: string;
  selectFile: string;
  searchPlaceholder: string;
  increase: string;
  decrease: string;
  /** Template: `{label}` */
  sliderRangeStart: string;
  /** Template: `{label}` */
  sliderRangeEnd: string;
};
 
export type BurneLabelsKey = keyof BurneLabels;
 
/** English defaults shipped with the library. */
export const DEFAULT_BURNE_LABELS: BurneLabels = {
  close: "Close",
  openSearch: "Open search",
  search: "Search",
  clearField: "Clear field",
  resizeColumn: "Resize column",
  resizeColumnNamed: "Resize column {name}",
  resizePanels: "Resize panels",
  time: "Time",
  timeHours: "hours",
  timeMinutes: "minutes",
  timeSeconds: "seconds",
  openList: "Open list",
  closeList: "Close list",
  showPassword: "Show password",
  hidePassword: "Hide password",
  removeFile: "Remove file",
  resizeHeight: "Resize height",
  breadcrumbs: "Breadcrumbs",
  breadcrumbsShowHidden: "Show {count} hidden sections",
  breadcrumbsHiddenSections: "Hidden sections",
  pagination: "Pagination",
  paginationPrevious: "Back",
  paginationNext: "Forward",
  paginationPage: "Page {n}",
  toastNotifications: "Notifications ({placement})",
  colorPickerArea: "Saturation and brightness",
  colorPickerAreaValue: "{saturation}% saturation, {brightness}% brightness",
  colorPickerContent: "Color selection",
  colorPickerHex: "Hex code of the color",
  colorPickerAlpha: "Transparency (%)",
  colorPickerSelected: "Selected color: {hex}",
  formErrorOne: "Fix the error in the form",
  formErrorMany: "Fix {count} errors in the form",
  formSubmitted: "Form submitted successfully",
  sliderMinimum: "Minimum range",
  sliderMaximum: "Maximum range",
  sliderValue: "Value",
  switch: "Switch",
  radioOption: "Option",
  calendarPrevious: "Previous",
  calendarNext: "Next",
  listBoxEmpty: "No matches",
  loading: "Loading",
  loadingStatus: "Loading…",
  toastError: "An error occurred",
  selectValue: "Select a value",
  selectDate: "Select a date",
  selectDateRange: "Select a range",
  selectFile: "Select file",
  searchPlaceholder: "Search…",
  increase: "Increase",
  decrease: "Decrease",
  sliderRangeStart: "{label}, minimum",
  sliderRangeEnd: "{label}, maximum",
};
 
/** Russian preset — pass to `BurneUIProvider` `labels={BURNE_LABELS_RU}`. */
export const BURNE_LABELS_RU: BurneLabels = {
  close: "Закрыть",
  openSearch: "Открыть поиск",
  search: "Поиск",
  clearField: "Очистить поле",
  resizeColumn: "Изменить ширину колонки",
  resizeColumnNamed: "Изменить ширину колонки {name}",
  resizePanels: "Изменить размер панелей",
  time: "Время",
  timeHours: "часы",
  timeMinutes: "минуты",
  timeSeconds: "секунды",
  openList: "Открыть список",
  closeList: "Закрыть список",
  showPassword: "Показать пароль",
  hidePassword: "Скрыть пароль",
  removeFile: "Удалить файл",
  resizeHeight: "Изменить высоту",
  breadcrumbs: "Навигационная цепочка",
  breadcrumbsShowHidden: "Показать скрытые разделы: {count}",
  breadcrumbsHiddenSections: "Скрытые разделы",
  pagination: "Пагинация",
  paginationPrevious: "Назад",
  paginationNext: "Вперёд",
  paginationPage: "Страница {n}",
  toastNotifications: "Уведомления ({placement})",
  colorPickerArea: "Насыщенность и яркость",
  colorPickerAreaValue: "Насыщенность {saturation}%, яркость {brightness}%",
  colorPickerContent: "Выбор цвета",
  colorPickerHex: "HEX-код цвета",
  colorPickerAlpha: "Прозрачность (%)",
  colorPickerSelected: "Выбранный цвет: {hex}",
  formErrorOne: "Исправьте ошибку в форме",
  formErrorMany: "Исправьте ошибки в форме: {count}",
  formSubmitted: "Форма успешно отправлена",
  sliderMinimum: "Минимум диапазона",
  sliderMaximum: "Максимум диапазона",
  sliderValue: "Значение",
  switch: "Переключатель",
  radioOption: "Вариант",
  calendarPrevious: "Назад",
  calendarNext: "Вперёд",
  listBoxEmpty: "Нет совпадений",
  loading: "Загрузка",
  loadingStatus: "Загрузка…",
  toastError: "Произошла ошибка",
  selectValue: "Выберите значение",
  selectDate: "Выберите дату",
  selectDateRange: "Выберите диапазон",
  selectFile: "Выберите файл",
  searchPlaceholder: "Поиск…",
  increase: "Увеличить",
  decrease: "Уменьшить",
  sliderRangeStart: "{label}, минимум",
  sliderRangeEnd: "{label}, максимум",
};
 
export function mergeBurneLabels(partial?: Partial<BurneLabels> | null): BurneLabels {
  if (!partial) return DEFAULT_BURNE_LABELS;
  return { ...DEFAULT_BURNE_LABELS, ...partial };
}
 
/** Replace `{name}` placeholders in a label template. */
export function formatBurneLabel(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}
 