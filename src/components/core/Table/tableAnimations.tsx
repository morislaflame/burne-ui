/**
 * Slot motion for Table — look here first.
 *
 * DOM slots: `root`, `scrollContainer`, `content`, `header`, `footer`,
 * `row` / `column` / `cell` (nested scopes).
 *
 * Not slots: `glossContent`, sort chevron (`useChevronRotation` kit-internal).
 * Host: root plays optional `enter`. Row plays `check`/`uncheck` on selection.
 * Defaults: empty.
 */
import { useLayoutEffect, useRef, type ForwardedRef, type ReactNode } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { IoChevronUp } from "react-icons/io5";

import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";

import { useOptionalTableMotionScope, useTableClassNames } from "./tableContext";
import { TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS, tableSortChevronClass } from "./tableStyles";
import type { SortDirection, TableMotion, TablePartMotion } from "./tableTypes";

import { cn } from "@/utils/cn";

export function resolveTableMotionDefaults(): TableMotion {
  return {};
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
  useOptionalEnterOnMount(scope, slot);
  return part;
}

export function useTableRowSelectionMotion(scope: MotionScopeValue | null, selected: boolean) {
  const prevRef = useRef<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    if (!scope) return;
    if (prevRef.current === undefined) {
      prevRef.current = selected;
      if (selected) {
        const el = scope.getTargets().row ?? null;
        if (!el) return;
        const value = scope.resolve("row", "enter");
        if (value !== undefined && value !== false) {
          scope.play("row", "enter", { el });
        }
      }
      return;
    }
    if (prevRef.current === selected) return;
    prevRef.current = selected;
    const el = scope.getTargets().row ?? null;
    if (!el) return;
    const phase = selected ? "check" : "uncheck";
    const value = scope.resolve("row", phase);
    if (value === undefined || value === false) return;
    scope.play("row", phase, { el });
  }, [scope, selected]);
}

export function TableSortChevron({
  direction,
  children,
}: {
  direction: SortDirection | undefined;
  children?: ReactNode;
}) {
  const slotClassNames = useTableClassNames();
  const chevronRef = useRef<HTMLSpanElement>(null);
  const bindChevronRef = useChevronRotation(direction === "descending", chevronRef, () => true);

  return (
    <span
      ref={bindChevronRef}
      aria-hidden
      className={cn(
        tableSortChevronClass(Boolean(direction)),
        slotClassNames.columnSortIcon,
      )}
    >
      {children ?? (
        <IoChevronUp className={TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS} />
      )}
    </span>
  );
}
