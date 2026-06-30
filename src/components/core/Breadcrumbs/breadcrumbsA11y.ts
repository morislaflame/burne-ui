export const DEFAULT_BREADCRUMBS_ARIA_LABEL = "Хлебные крошки";

export function resolveBreadcrumbsAriaLabel(ariaLabel?: string): string {
  return ariaLabel ?? DEFAULT_BREADCRUMBS_ARIA_LABEL;
}

export function ellipsisTriggerAriaLabel(count: number): string {
  return `Показать ${count} скрытых разделов`;
}

export const BREADCRUMBS_ELLIPSIS_POPOVER_ARIA_LABEL = "Скрытые разделы";
