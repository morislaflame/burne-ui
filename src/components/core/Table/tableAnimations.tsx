import { useRef } from "react";
import { IoChevronUp } from "react-icons/io5";

import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

import { useTableClassNames } from "./tableContext";
import { TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS, tableSortChevronClass } from "./tableStyles";
import type { SortDirection } from "./tableTypes";

import { cn } from "@/utils/cn";

export function TableSortChevron({ direction }: { direction: SortDirection | undefined }) {
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
      <IoChevronUp className={TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS} />
    </span>
  );
}
