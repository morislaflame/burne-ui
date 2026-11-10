import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationCustomLabelsDemo() {
  const [page, setPage] = useState(2);

  return (
    <Pagination page={page} totalPages={8} onPageChange={setPage} className="w-full max-w-component-mid">
      <Pagination.Summary>
        Page {page} from 8
      </Pagination.Summary>
      <Pagination.Content className="mx-auto">
        <Pagination.Item>
          <Pagination.Previous>
            <Pagination.PreviousIcon />
            <span className="text-base">Back</span>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Page page={1} />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis>···</Pagination.Ellipsis>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Page page={page} />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis>···</Pagination.Ellipsis>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Page page={8} />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next>
            <span className="text-base">Forward</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
