import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

/** Narrow parent — controls wrap instead of overflowing. */
export function PaginationWithPagesDemo() {
  const [page, setPage] = useState(5);

  return (
    <div className="w-full max-w-component-mid">
      <Pagination page={page} totalPages={20} onPageChange={setPage}>
        <Pagination.Summary>
          Page {page} of 20
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
    </div>
  );
}
