import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationCustomLabelsDemo() {
  const [page, setPage] = useState(2);

  return (
    <Pagination page={page} totalPages={8} onPageChange={setPage} className="w-full max-w-md">
      <Pagination.Summary>
        Страница {page} из 8
      </Pagination.Summary>
      <Pagination.Content className="mx-auto">
        <Pagination.Item>
          <Pagination.Previous>
            <Pagination.PreviousIcon />
            <span>Назад</span>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Pages />
        <Pagination.Item>
          <Pagination.Next>
            <span>Вперёд</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
