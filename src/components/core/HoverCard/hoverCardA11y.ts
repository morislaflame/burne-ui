import { popoverTriggerA11y } from "@/components/core/Popover/popoverA11y";

/** Trigger announces a dialog and points `aria-controls` at the open card. */
export function hoverCardTriggerA11y(open: boolean, cardId: string) {
  return popoverTriggerA11y(open, cardId);
}
