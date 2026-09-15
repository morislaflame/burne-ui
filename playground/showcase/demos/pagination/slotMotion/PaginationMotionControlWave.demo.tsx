import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";

export function PaginationMotionControlWaveDemo() {
  const [page, setPage] = useState(4);

  return (
    <Pagination
      page={page}
      totalPages={12}
      onPageChange={setPage}
      motion={{
        control: {
          pressIn: (ctx) => ctx.to({ y: 2, scale: 0.94, duration: 0.1 }),
          pressOut: (ctx) => ctx.to({ y: 0, scale: 1, duration: 0.16 }),
        },
        previousIcon: {
          pressIn: { y: -3, duration: 0.14 },
          pressOut: { y: 0, duration: 0.14 },
        },
        nextIcon: {
          pressIn: { y: -3, duration: 0.14 },
          pressOut: { y: 0, duration: 0.14 },
        },
        summary: {
          change: (ctx) =>
            ctx.to({ y: -4, duration: 0.14, yoyo: true, repeat: 1 }),
        },
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
