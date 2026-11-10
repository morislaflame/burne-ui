import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationMotionEllipsisDemo() {
  const [page, setPage] = useState(4);

  return (
    <Pagination
      page={page}
      totalPages={12}
      onPageChange={setPage}
      motion={{
        ellipsis: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22 }),
        },
      }}
    >
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
