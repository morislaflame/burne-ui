import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "pagination:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "pagination:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function PaginationMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [page, setPage] = useState(5);
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("summary", "pagination:out", { waitForComplete: true }).finished;
      await controller.playSlot("summary", "pagination:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
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
