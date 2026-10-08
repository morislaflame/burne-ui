import { POPOVER_TRIGGER_CLASS } from "@/components/core/Popover/popoverStyles";

import { cn } from "@/utils/cn";

export function hoverCardTriggerClass({
  rootSlot,
  slotClass,
  className,
}: {
  rootSlot?: string;
  slotClass?: string;
  className?: string;
}) {
  return cn(POPOVER_TRIGGER_CLASS, rootSlot, slotClass, className);
}
