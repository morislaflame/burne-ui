import type { ClassValue } from "clsx";
import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import type { Prettify } from "@/utils/prettify";

import { cn } from "@/utils/cn";

import { SELECTION_INDICATOR_DOT_CLASS, selectionIndicatorDotInnerClass, type SelectionIndicatorSize, type SelectionIndicatorVariant } from "./selectionIndicatorTokens";

import type {
  ResolvedSelectionIndicatorClassNames,
  SelectionIndicatorClassNames,
  SelectionIndicatorFillProps,
  SelectionIndicatorMarkProps,
} from "./selectionIndicatorTypes";

export const SELECTION_INDICATOR_FILL_DISPLAY_NAME = "SelectionIndicatorFill";
export const SELECTION_INDICATOR_MARK_DISPLAY_NAME = "SelectionIndicatorMark";

export function isSelectionIndicatorFillElement(
  el: ReactElement,
): el is ReactElement<SelectionIndicatorFillProps> {
  return (el.type as { displayName?: string }).displayName === SELECTION_INDICATOR_FILL_DISPLAY_NAME;
}

export function isSelectionIndicatorMarkElement(
  el: ReactElement,
): el is ReactElement<SelectionIndicatorMarkProps> {
  return (el.type as { displayName?: string }).displayName === SELECTION_INDICATOR_MARK_DISPLAY_NAME;
}

export type PartitionedSelectionIndicatorChildren = {
  fillSlot?: ReactElement<SelectionIndicatorFillProps>;
  markSlot?: ReactElement<SelectionIndicatorMarkProps>;
  legacyIcon?: ReactNode;
};

export function resolveSelectionIndicatorMarkContent({
  resolvedIcon,
  showCheck,
  showDot,
  size,
  variant,
}: {
  resolvedIcon?: ReactNode;
  showCheck: boolean;
  showDot: boolean;
  size: SelectionIndicatorSize;
  variant: SelectionIndicatorVariant;
}): ReactNode {
  if (resolvedIcon != null) return resolvedIcon;
  if (showCheck) {
    return createElement(IoCheckmarkSharp, { "aria-hidden": true, className: "size-full" });
  }
  if (showDot) {
    return createElement("span", {
      "aria-hidden": true,
      className: cn(
        SELECTION_INDICATOR_DOT_CLASS[size],
        selectionIndicatorDotInnerClass(variant),
      ),
    });
  }
  return undefined;
}

export function usesCompoundSelectionIndicatorChildren(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (isSelectionIndicatorFillElement(child) || isSelectionIndicatorMarkElement(child)),
  );
}

export function partitionSelectionIndicatorChildren(
  children: ReactNode,
): PartitionedSelectionIndicatorChildren {
  const parts = Children.toArray(children);
  let fillSlot: ReactElement<SelectionIndicatorFillProps> | undefined;
  let markSlot: ReactElement<SelectionIndicatorMarkProps> | undefined;
  const legacy: ReactNode[] = [];

  for (const child of parts) {
    if (isValidElement(child) && isSelectionIndicatorFillElement(child)) {
      fillSlot = child;
      continue;
    }
    if (isValidElement(child) && isSelectionIndicatorMarkElement(child)) {
      markSlot = child;
      continue;
    }
    legacy.push(child);
  }

  return {
    fillSlot,
    markSlot,
    legacyIcon:
      legacy.length === 0
        ? undefined
        : legacy.length === 1
          ? legacy[0]
          : legacy,
  };
}

export function resolveSelectionIndicatorClassNames({
  root,
  fill,
  mark,
  classNames,
  className,
}: {
  root?: ClassValue;
  fill?: ClassValue;
  mark?: ClassValue;
  classNames?: Prettify<SelectionIndicatorClassNames>;
  className?: string;
}): ResolvedSelectionIndicatorClassNames {
  return {
    root: cn(root, classNames?.root, className),
    fill: cn(fill, classNames?.fill),
    mark: cn(mark, classNames?.mark),
  };
}
