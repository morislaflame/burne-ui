import { cn } from "@/utils/cn";

/** Grid slots for Alert / Toast / Tooltip: indicator | title+description | action | close. */
export type MessageBannerGridSlots = {
  hasIndicator: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
  hasAction: boolean;
  hasClose: boolean;
};

function messageBannerContentCol(hasIndicator: boolean): 1 | 2 {
  return hasIndicator ? 2 : 1;
}

function messageBannerActionCol(slots: MessageBannerGridSlots): 2 | 3 | 4 | null {
  if (!slots.hasAction) return null;
  const base = messageBannerContentCol(slots.hasIndicator);
  return (base + 1) as 2 | 3 | 4;
}

function messageBannerCloseCol(slots: MessageBannerGridSlots): 2 | 3 | 4 | null {
  if (!slots.hasClose) return null;
  const base = messageBannerContentCol(slots.hasIndicator);
  return (base + (slots.hasAction ? 2 : 1)) as 2 | 3 | 4;
}

function messageBannerGridCols(slots: MessageBannerGridSlots): string {
  const { hasIndicator, hasAction, hasClose } = slots;

  if (hasIndicator && hasAction && hasClose) {
    return "grid-cols-[auto_minmax(0,1fr)_auto_auto]";
  }
  if (hasIndicator && (hasAction || hasClose)) {
    return "grid-cols-[auto_minmax(0,1fr)_auto]";
  }
  if (hasIndicator) {
    return "grid-cols-[auto_minmax(0,1fr)]";
  }
  if (hasAction && hasClose) {
    return "grid-cols-[minmax(0,1fr)_auto_auto]";
  }
  if (hasAction || hasClose) {
    return "grid-cols-[minmax(0,1fr)_auto]";
  }
  return "grid-cols-[minmax(0,1fr)]";
}

const COL_START = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
} as const;

export function messageBannerGridClass(
  slots: MessageBannerGridSlots,
  gapX = "gap-x-base",
) {
  const stackedContent = slots.hasTitle && slots.hasDescription;

  return cn(
    "grid w-full min-w-0 text-left",
    messageBannerGridCols(slots),
    stackedContent
      ? "grid-rows-[auto_auto] gap-y-xsmall"
      : "grid-rows-[auto]",
    gapX,
  );
}

export function messageBannerIndicatorCellClass(slots: MessageBannerGridSlots) {
  if (!slots.hasIndicator) return "hidden";
  return "col-start-1 row-start-1 self-center shrink-0";
}

export function messageBannerTitleCellClass(slots: MessageBannerGridSlots) {
  return cn(
    "row-start-1 self-center min-w-0 max-w-full justify-self-start",
    COL_START[messageBannerContentCol(slots.hasIndicator)],
  );
}

export function messageBannerDescriptionCellClass(slots: MessageBannerGridSlots) {
  return cn(
    slots.hasTitle ? "row-start-2" : "row-start-1",
    "self-center min-w-0 max-w-full justify-self-start",
    COL_START[messageBannerContentCol(slots.hasIndicator)],
  );
}

export function messageBannerActionCellClass(slots: MessageBannerGridSlots) {
  const col = messageBannerActionCol(slots);
  if (col == null) return "hidden";
  return cn("row-start-1 self-center shrink-0 justify-self-end", COL_START[col]);
}

export function messageBannerCloseCellClass(slots: MessageBannerGridSlots) {
  const col = messageBannerCloseCol(slots);
  if (col == null) return "hidden";
  return cn("row-start-1 self-center shrink-0 justify-self-end", COL_START[col]);
}
