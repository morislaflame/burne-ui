import { useRef } from "react";
import { IoChevronUp } from "react-icons/io5";

import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

import { mergeTableSlotClass } from "./tableAPI";
import { useTableClassNames } from "./tableContext";
import { tableSortChevronClass } from "./tableStyles";
import type { SortDirection } from "./tableTypes";

export function TableSortChevron({ direction }: { direction: SortDirection | undefined }) {
  const slotClassNames = useTableClassNames();
  const chevronRef = useRef<HTMLSpanElement>(null);
  const bindChevronRef = useChevronRotation(direction === "descending", chevronRef, () => true);

  return (
    <span
      ref={bindChevronRef}
      aria-hidden
      className={mergeTableSlotClass(
        tableSortChevronClass(Boolean(direction)),
        slotClassNames.columnSortChevron,
      )}
    >
      <IoChevronUp className="icon-xsmall" />
    </span>
  );
}
