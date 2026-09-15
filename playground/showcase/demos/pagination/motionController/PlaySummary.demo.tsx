import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function PaginationMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  const [page, setPage] = useState(5);

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("summary", "hoverIn")}>
          playSlot(summary)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("summary", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("summary", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Pagination
        page={page}
        totalPages={20}
        onPageChange={setPage}
        motionController={controller}
        motion={{
          control: { pressIn: false, pressOut: false },
          summary: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <Pagination.Summary>Page {page} of 20</Pagination.Summary>
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
