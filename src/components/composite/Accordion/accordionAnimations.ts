/**
 * Slot motion for Accordion — look here first.
 *
 * Accordion is an embedder: it has no `createMotionScope`. Each Item is
 * `Expandable`; root/item `motion` maps are merged and passed through.
 * Host play and kit defaults live in `expandableAnimations.ts`.
 *
 * DOM slots (per Item, same as Expandable): `triggerLift`, `chevron`, `panelShell`,
 * `title`, `icon`, `description`, `body` (`Expandable.Panel` `<section>`).
 * `panelInner` is an internal height-recipe target, not a public slot.
 * `Accordion.Body` is optional `text-muted` wrap, not a motion slot.
 * `Accordion.Heading` is not a slot (a11y wrapper).
 *
 * `Accordion.Chevron` registers the Expandable `chevron` target (Trigger
 * defaults to `hideChevron`). Play is still the Expandable trigger host.
 * `motionController` on `Accordion.Item` is forwarded to that Expandable.
 */
import { mergeMotionSlotMaps, mergeMotionRootSiblings, splitMotionRootMap } from "@/components/core/utils/slotMotion";
import type { MotionMapWithEvents } from "@/components/core/utils/slotMotion";

import type { AccordionMotion } from "./accordionTypes";

export function resolveAccordionItemMotion({
  rootMotion,
  itemMotion,
}: {
  rootMotion?: MotionMapWithEvents<AccordionMotion>;
  itemMotion?: MotionMapWithEvents<AccordionMotion>;
}): MotionMapWithEvents<AccordionMotion> | undefined {
  const slots = mergeMotionSlotMaps(rootMotion, itemMotion) as AccordionMotion | undefined;
  const siblings = mergeMotionRootSiblings(
    splitMotionRootMap(rootMotion),
    splitMotionRootMap(itemMotion),
  );
  if (!slots && !siblings.events && !siblings.states) return undefined;
  return { ...slots, ...siblings };
}
