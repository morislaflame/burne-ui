import { useState } from "react";

import { Pagination } from "@/components/core/Pagination";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function PaginationMotionControllerPlayControlDemo() {
  const controller = useMotionControllerHandle();
  const [page, setPage] = useState(5);

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("control", "hoverIn")}>
          playSlot(control)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("control", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("control", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Pagination page={page} totalPages={20} onPageChange={setPage}>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              motionController={controller}
              motion={{
                hoverIn: { y: -6, duration: 0.22, replay: "rest" },
                hoverOut: { y: 0, duration: 0.16 },
              }}
            />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}
