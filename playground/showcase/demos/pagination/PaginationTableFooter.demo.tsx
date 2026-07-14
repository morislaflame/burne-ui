import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function PaginationTableFooterDemo() {
  const [page, setPage] = useState(3);
  const totalPages = 12;
  const pageSize = 10;
  const total = 118;

  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-component-mid">
      <div className="flex min-w-0 flex-col gap-mid">
        <Text as="span" variant="tools" className="text-muted">
          Shown {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} from {total}
        </Text>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage}>
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
    </Surface>
  );
}
