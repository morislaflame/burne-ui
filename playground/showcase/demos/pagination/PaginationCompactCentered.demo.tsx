import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationCompactCenteredDemo() {
  const [page, setPage] = useState(5);

  return (
    <Pagination page={page} totalPages={20} onPageChange={setPage} className="w-full max-w-md justify-center">
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
