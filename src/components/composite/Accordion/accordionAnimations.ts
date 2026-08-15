/**
 * Slot motion for Accordion — look here first.
 *
 * Accordion is an embedder: it has no `createMotionScope`. Each Item is
 * `Expandable`; root/item `motion` maps are merged and passed through.
 * Host play and kit defaults live in `expandableAnimations.ts`.
 *
 * DOM slots (per Item, same as Expandable): `triggerLift`, `chevron`, `panelShell`
 * (`panelInner` is an internal height-recipe target, not a public slot).
 *
 * `Accordion.Chevron` registers the Expandable `chevron` target (Trigger
 * defaults to `hideChevron`). Play is still the Expandable trigger host.
 */
import type { ExpandableMotion } from "@/components/core/Expandable";
import { mergeMotionSlotMaps } from "@/components/core/utils/slotMotion";

import type { AccordionMotion } from "./accordionTypes";

export function resolveAccordionItemMotion({
  rootMotion,
  itemMotion,
}: {
  rootMotion?: AccordionMotion;
  itemMotion?: AccordionMotion;
}): ExpandableMotion | undefined {
  return mergeMotionSlotMaps(rootMotion, itemMotion) as ExpandableMotion | undefined;
}
