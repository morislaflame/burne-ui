import { DEFAULT_BURNE_LABELS, formatBurneLabel } from "@/theme/burneLabels";

export function resolveBreadcrumbsAriaLabel(
  ariaLabel?: string,
  breadcrumbsLabel: string = DEFAULT_BURNE_LABELS.breadcrumbs,
): string {
  return ariaLabel ?? breadcrumbsLabel;
}

export function ellipsisTriggerAriaLabel(
  count: number,
  template: string = DEFAULT_BURNE_LABELS.breadcrumbsShowHidden,
): string {
  return formatBurneLabel(template, { count });
}

export function breadcrumbsEllipsisPopoverAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.breadcrumbsHiddenSections,
): string {
  return label;
}
