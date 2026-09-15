import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "pagination:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -4, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.ellipsis) {
      tl.fromRest(ctx.targets.ellipsis, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.ellipsis) {
      tl.to(ctx.targets.ellipsis, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function PaginationMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();
  const [page, setPage] = useState(5);

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("summary", "pagination:scan")}>
        Scan
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
