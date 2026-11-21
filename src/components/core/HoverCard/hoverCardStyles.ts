import { cn } from "@/utils/cn";

export function hoverCardTriggerClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 border-0 bg-transparent outline-none focus-ring",
    slotClass,
    className,
  );
}
