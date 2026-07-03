export const DEFAULT_BREADCRUMBS_ARIA_LABEL = "Breadcrumbs";

export function resolveBreadcrumbsAriaLabel(ariaLabel?: string): string {
  return ariaLabel ?? DEFAULT_BREADCRUMBS_ARIA_LABEL;
}

export function ellipsisTriggerAriaLabel(count: number): string {
  return `Show ${count} hidden sections`;
}

export const BREADCRUMBS_ELLIPSIS_POPOVER_ARIA_LABEL = "Hidden sections";
