import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationCompactDemo() {
  const [page, setPage] = useState(1);

  return (
    <Pagination page={page} totalPages={10} onPageChange={setPage}>
      <Pagination.Summary>Страница {page} из 10</Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
