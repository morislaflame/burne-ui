export function popoverLabelId(popoverId: string): string {
  return `${popoverId}-label`;
}

export function popoverHintId(popoverId: string): string {
  return `${popoverId}-hint`;
}

export function resolvePopoverDescribedBy({
  contentRole,
  labelConnected,
  hintConnected,
  labelId,
  hintId,
}: {
  contentRole?: "dialog";
  labelConnected: boolean;
  hintConnected: boolean;
  labelId: string;
  hintId: string;
}): string | undefined {
  if (contentRole !== "dialog") return undefined;
  if (labelConnected && hintConnected) return `${labelId} ${hintId}`;
  if (hintConnected) return hintId;
  return undefined;
}

export function resolvePopoverLabelledBy({
  contentRole,
  labelConnected,
  labelId,
}: {
  contentRole?: "dialog";
  labelConnected: boolean;
  labelId: string;
}): string | undefined {
  if (contentRole === "dialog" && labelConnected) return labelId;
  return undefined;
}

const POPOVER_FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** First keyboard-focusable control inside a popover panel. */
export function getFirstFocusableInPopover(
  root: HTMLElement,
): HTMLElement | null {
  const nodes = root.querySelectorAll<HTMLElement>(POPOVER_FOCUSABLE_SELECTOR);
  for (const el of nodes) {
    if (el.closest("[aria-hidden='true']")) continue;
    return el;
  }
  return null;
}
