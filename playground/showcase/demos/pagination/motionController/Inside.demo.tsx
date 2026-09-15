import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "pagination:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function SummaryPulse() {
  const controller = useMotionController();
  return (
    <Pagination.Summary onPointerEnter={() => controller.playSlot("summary", "pagination:nudge")}>
      Hover summary
    </Pagination.Summary>
  );
}

export function PaginationMotionControllerInsideDemo() {
  const [page, setPage] = useState(5);

  return (
    <Pagination
      page={page}
      totalPages={20}
      onPageChange={setPage}
      motion={{ control: { pressIn: false, pressOut: false }, events }}
    >
      <SummaryPulse />
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
