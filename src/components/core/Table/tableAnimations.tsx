/**
 * Slot motion for Table — look here first.
 *
 * DOM slots: `root`, `scrollContainer`, `content`, `header`, `headerRow`, `body`,
 * `footer`, nested `row` (one scope per row); `column` (repeated on table scope),
 * `cell` (repeated on the row scope), `label` (`Table.Label`, repeated on table scope),
 * `caption` (`Table.Caption`), `empty` (`Table.Empty`).
 *
 * `columnSortIcon` rotates with `chevronRotate` (`enter` open, `leave` closed).
 * `emptyCell` is CSS for `Table.Empty`, not a motion key.
 * Host: unique slots play optional `enter` via `useOptionalEnterOnMount` + `targetRef`.
 * Row selection is `check` / `uncheck` (`skipFirst` — not a second `enter`).
 */
import { useRef, type ForwardedRef, type ReactNode, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { KitChevronUp } from "@/components/core/utils/kitIcons";
 
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
 
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import { useOptionalTableMotionScope, useTableClassNames } from "./tableContext";
import { TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS, tableSortChevronClass } from "./tableStyles";
import type { SortDirection, TableMotion, TablePartMotion, TableVariant } from "./tableTypes";
import { KIT_TABLE_VARIANTS } from "./tableTypes";
 
import { cn } from "@/utils/cn";
 
export function resolveTableMotionDefaults(variant: TableVariant = "default"): TableMotion {
  return overlaySkinMotion(
    { columnSortIcon: { enter: "chevronRotate", leave: "chevronRotate" } },
    variant,
    KIT_TABLE_VARIANTS,
    "table",
  );
}
 
export function useTableSlotMotion<T extends HTMLElement>(
  slot: keyof TableMotion,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: TablePartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  } = {},
) {
  const scope = useOptionalTableMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
 
export function useTableRowSelectionMotion(
  scope: MotionScopeValue | null,
  selected: boolean,
  target?: RefObject<HTMLElement | null>,
) {
  useSlotPhaseOnChange(scope, "row", selected, {
    phase: selected ? "check" : "uncheck",
    skipFirst: true,
    target,
  });
}
 
export function TableSortChevron({
  direction,
  children,
}: {
  direction: SortDirection | undefined;
  children?: ReactNode;
}) {
  const slotClassNames = useTableClassNames();
  const scope = useOptionalTableMotionScope();
  const chevronRef = useRef<HTMLSpanElement>(null);
  const bindChevronRef = useChevronRotation(
    direction === "descending",
    chevronRef,
    undefined,
    undefined,
    scope,
    "columnSortIcon",
  );
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "columnSortIcon",
    pointerPhases: false,
  });
  const setChevronRef = (node: HTMLSpanElement | null) => {
    bindChevronRef(node);
    part.setRef(node);
  };
 
  return (
    <span
      ref={setChevronRef}
      aria-hidden
      className={cn(
        tableSortChevronClass(Boolean(direction)),
        slotClassNames.columnSortIcon,
      )}
    >
      {children ?? (
        <KitChevronUp className={TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS} />
      )}
    </span>
  );
}
 