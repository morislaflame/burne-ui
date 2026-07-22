import { useRef, type ReactNode } from "react";
import { IoChevronUp } from "react-icons/io5";

import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

import { useTableClassNames } from "./tableContext";
import { TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS, tableSortChevronClass } from "./tableStyles";
import type { SortDirection } from "./tableTypes";

import { cn } from "@/utils/cn";

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
        slotClassNames.columnSortChevron,
      )}
    >
      {children ?? (
        <IoChevronUp className={TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS} />
      )}
    </span>
  );
}
