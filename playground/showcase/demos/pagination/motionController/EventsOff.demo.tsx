import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "pagination:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "pagination:nudge": false });

export function PaginationMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  const [page, setPage] = useState(5);

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("summary", "pagination:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("summary", "pagination:nudge")}>
          Off nudge
        </Button>
      </div>
      <Pagination
        page={page}
        totalPages={20}
        onPageChange={setPage}
        motionController={liveController}
        motion={{
          control: { pressIn: false, pressOut: false },
          events: live,
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
      <Pagination
        page={page}
        totalPages={20}
        onPageChange={setPage}
        motionController={offController}
        motion={{
          control: { pressIn: false, pressOut: false },
          events: off,
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
