import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "pagination:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function PaginationMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  const [page, setPage] = useState(5);

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("summary", "pagination:nudge")}>
        Nudge
      </Button>
      <Pagination
        page={page}
        totalPages={20}
        onPageChange={setPage}
        motionController={controller}
        motion={{
          control: { pressIn: false, pressOut: false },
          events,
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
