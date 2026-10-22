import type { ExpandableClassNames } from "@/components/core/Expandable";
 
import type { AccordionClassNames } from "./accordionTypes";
 
/** Maps Accordion slots onto the `Expandable` instance wrapped by `Accordion.Item`. */
export function resolveAccordionItemExpandableClassNames(
  classNames: AccordionClassNames,
): ExpandableClassNames {
  return {
    root: classNames.item,
    trigger: classNames.trigger,
    triggerLift: classNames.triggerLift,
    message: classNames.message,
    icon: classNames.icon,
    content: classNames.content,
    title: classNames.title,
    description: classNames.description,
    chevron: classNames.chevron,
    panelShell: classNames.panelShell,
    contentWrap: classNames.contentWrap,
    triggerRippleOverlay: classNames.triggerRippleOverlay,
    panel: classNames.panel,
  };
}
 