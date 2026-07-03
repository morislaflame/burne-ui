import { cn } from "@/utils/cn";

export type OptionControlLabelSide = "left" | "right";

/** Grid rows: label in row 1, hint/error — row 2 (+ row 3 when both hint and error). */
function optionControlSecondaryLineCount(hasHint: boolean, hasError: boolean): number {
  return (hasHint ? 1 : 0) + (hasError ? 1 : 0);
}

export function optionControlGridClass(
  secondaryLines: number,
  gapX: string,
  labelSide: OptionControlLabelSide = "right",
  extra?: string,
) {
  const cols =
    labelSide === "left"
      ? "grid-cols-[minmax(0,1fr)_auto]"
      : "grid-cols-[auto_minmax(0,1fr)]";

  const rows =
    secondaryLines >= 2
      ? "grid-rows-[auto_auto_auto]"
      : secondaryLines === 1
        ? "grid-rows-[auto_auto]"
        : "grid-rows-[auto] items-center";

  return cn("grid", cols, rows, gapX, extra);
}

export function optionControlCellClass(labelSide: OptionControlLabelSide = "right") {
  return cn(
    "row-start-1 self-center justify-self-start",
    labelSide === "left" ? "col-start-2" : "col-start-1",
  );
}

export function optionLabelCellClass(labelSide: OptionControlLabelSide = "right") {
  return cn(
    "row-start-1 inline-flex min-w-0 max-w-full items-center justify-self-start [width:fit-content]",
    labelSide === "left" ? "col-start-1" : "col-start-2",
  );
}

/** row: 2 — hint or sole secondary; 3 — error when hint is present. */
export function optionSecondaryCellClass(
  row: 2 | 3,
  labelSide: OptionControlLabelSide = "right",
) {
  return cn(
    row === 2 ? "row-start-2" : "row-start-3",
    "min-w-0 max-w-full justify-self-start [width:fit-content]",
    labelSide === "left" ? "col-start-1" : "col-start-2",
  );
}

export function optionErrorRow(hasHint: boolean): 2 | 3 {
  return hasHint ? 3 : 2;
}

/** Grid for Dropdown / ListBox item: indicator | label+hint | icon (icon row 1 only). */
export function optionListItemGridClass(
  hasHint: boolean,
  gapX: string,
  hasIndicator: boolean,
  hasIcon: boolean,
) {
  const cols =
    hasIndicator && hasIcon
      ? "grid-cols-[auto_minmax(0,1fr)_auto]"
      : hasIndicator
        ? "grid-cols-[auto_minmax(0,1fr)]"
        : hasIcon
          ? "grid-cols-[minmax(0,1fr)_auto]"
          : "grid-cols-[minmax(0,1fr)]";

  const rows = hasHint ? "grid-rows-[auto_auto] gap-y-xsmall" : "grid-rows-[auto] items-center";

  return cn("grid w-full min-w-0 text-left", cols, rows, gapX);
}

export function optionListItemIndicatorCellClass() {
  return optionControlCellClass();
}

export function optionListItemLabelCellClass(hasIndicator: boolean) {
  if (hasIndicator) return optionLabelCellClass();
  return cn(
    "row-start-1 col-start-1 inline-flex min-w-0 max-w-full items-center justify-self-start [width:fit-content]",
  );
}

export function optionListItemHintCellClass(hasIndicator: boolean) {
  if (hasIndicator) return optionSecondaryCellClass(2);
  return cn(
    "row-start-2 col-start-1 min-w-0 max-w-full justify-self-start [width:fit-content]",
  );
}

export function optionListItemIconCellClass(hasIndicator: boolean) {
  return cn(
    "row-start-1 self-center shrink-0 justify-self-end",
    hasIndicator ? "col-start-3" : "col-start-2",
  );
}

void optionControlSecondaryLineCount;
