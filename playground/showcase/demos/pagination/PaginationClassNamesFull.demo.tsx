import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationClassNamesFullDemo() {
  const [page, setPage] = useState(3);
  const totalPages = 12;

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      classNames={{
        root: "rounded-mid border border-primary/25 p-base",
        summaryText: "text-primary font-medium",
        content: "gap-small",
        interactiveButton: "text-muted hover:text-primary",
        pageActive: "text-primary font-semibold",
        ellipsis: "text-warning",
      }}
    >
      <Pagination.Summary>
        Страница {page} из {totalPages}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous />
        </Pagination.Item>
        <Pagination.Pages />
        <Pagination.Item>
          <Pagination.Next />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
