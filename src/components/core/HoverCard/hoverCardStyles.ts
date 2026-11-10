import { POPOVER_TRIGGER_CLASS } from "@/components/core/Popover/popoverStyles";

import { cn } from "@/utils/cn";

export function hoverCardTriggerClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}) {
  return cn(POPOVER_TRIGGER_CLASS, slotClass, className);
}
