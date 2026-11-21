import { focusKeyboard } from "@/components/core/utils/focusElement";
 
export function tabsTabId(baseId: string, tabValue: string): string {
  return `${baseId}-tab-${tabValue}`;
}
 
export function tabsPanelId(baseId: string, panelValue: string): string {
  return `${baseId}-panel-${panelValue}`;
}
 
export function tabsTabA11y({
  isSelected,
  isTabStop = isSelected,
  isDisabled,
  panelId,
}: {
  isSelected: boolean;
  isTabStop?: boolean;
  isDisabled: boolean | undefined;
  panelId: string;
}) {
  return {
    "aria-selected": isSelected,
    "aria-controls": panelId,
    tabIndex: !isDisabled && isTabStop ? 0 : -1,
    disabled: isDisabled,
  } as const;
}
 
export function tabsPanelA11y({
  isSelected,
  tabId,
}: {
  isSelected: boolean;
  tabId: string;
}) {
  return {
    "aria-labelledby": tabId,
    hidden: !isSelected,
    tabIndex: isSelected ? 0 : -1,
  } as const;
}
 
export function collectTabButtons(list: HTMLElement): HTMLElement[] {
  return Array.from(
    list.querySelectorAll('[role="tab"]:not([disabled]):not([aria-disabled="true"])'),
  ).filter((el): el is HTMLElement => el instanceof HTMLElement);
}
 
export function focusTabAt(list: HTMLElement, index: number) {
  const tabs = collectTabButtons(list);
  if (tabs.length === 0) return null;
  const next = tabs[Math.max(0, Math.min(index, tabs.length - 1))]!;
  focusKeyboard(next);
  return next;
}
 