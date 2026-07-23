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
  drawerDragDownToClose: string;
  drawerDragUpToClose: string;
  drawerDragLeftToClose: string;
  drawerDragRightToClose: string;
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
};

export type BurneLabelsKey = keyof BurneLabels;

/** English defaults shipped with the library. */
export const DEFAULT_BURNE_LABELS: BurneLabels = {
  close: "Close",
  openSearch: "Open search",
  search: "Search",
  clearField: "Clear field",
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
  drawerDragDownToClose: "Drag down to close",
  drawerDragUpToClose: "Drag up to close",
  drawerDragLeftToClose: "Drag left to close",
  drawerDragRightToClose: "Drag right to close",
  toastNotifications: "Notifications ({placement})",
  colorPickerArea: "Saturation and brightness",
  colorPickerAreaValue: "{saturation}% saturation, {brightness}% brightness",
  colorPickerContent: "Color selection",
  colorPickerHex: "Hex code of the color",
  colorPickerAlpha: "Transparency (%)",
  colorPickerSelected: "Selected color: {hex}",
};

/** Russian preset — pass to `BurneUIProvider` `labels={BURNE_LABELS_RU}`. */
export const BURNE_LABELS_RU: BurneLabels = {
  close: "Закрыть",
  openSearch: "Открыть поиск",
  search: "Поиск",
  clearField: "Очистить поле",
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
  drawerDragDownToClose: "Потяните вниз, чтобы закрыть",
  drawerDragUpToClose: "Потяните вверх, чтобы закрыть",
  drawerDragLeftToClose: "Потяните влево, чтобы закрыть",
  drawerDragRightToClose: "Потяните вправо, чтобы закрыть",
  toastNotifications: "Уведомления ({placement})",
  colorPickerArea: "Насыщенность и яркость",
  colorPickerAreaValue: "Насыщенность {saturation}%, яркость {brightness}%",
  colorPickerContent: "Выбор цвета",
  colorPickerHex: "HEX-код цвета",
  colorPickerAlpha: "Прозрачность (%)",
  colorPickerSelected: "Выбранный цвет: {hex}",
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
