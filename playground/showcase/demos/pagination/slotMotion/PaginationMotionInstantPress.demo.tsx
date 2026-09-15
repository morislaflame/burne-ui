import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationMotionInstantPressDemo() {
  const [page, setPage] = useState(3);

  return (
    <Pagination
      page={page}
      totalPages={12}
      onPageChange={setPage}
      motion={{
        control: { pressIn: false },
      }}
    >
      <Pagination.Summary>Page {page} of 12</Pagination.Summary>
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
