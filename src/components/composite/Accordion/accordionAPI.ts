import type { ExpandableClassNames } from "@/components/core/Expandable";

import type { AccordionClassNames } from "./accordionTypes";

export function accordionDefaultValue(
  defaultValue: string | null | undefined,
  defaultOpenIndex: number | null | undefined,
): string | null {
  if (defaultValue != null) return defaultValue;
  if (defaultOpenIndex != null) return String(defaultOpenIndex);
  return null;
}

/** Maps Accordion slots onto the `Expandable` instance wrapped by `Accordion.Item`. */
export function resolveAccordionItemExpandableClassNames(
  classNames: AccordionClassNames,
): ExpandableClassNames {
  return {
    root: classNames.item,
    glossContent: classNames.glossContent,
    trigger: classNames.trigger,
    triggerLift: classNames.triggerLift,
    message: classNames.message,
    icon: classNames.icon,
    content: classNames.content,
    title: classNames.title,
    description: classNames.description,
    chevron: classNames.chevron,
    panelShell: classNames.panelShell,
    panel: classNames.panel,
  };
}
