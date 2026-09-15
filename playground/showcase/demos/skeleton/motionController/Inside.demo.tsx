import type { ReactNode } from "react";

import { Skeleton } from "@/components/core/Skeleton";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "skel:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HoverRegion({ children }: { children: ReactNode }) {
  const controller = useMotionController();
  return (
    <div onPointerEnter={() => controller.playSlot("region", "skel:nudge")}>{children}</div>
  );
}

export function SkeletonMotionControllerInsideDemo() {
  return (
    <Skeleton.Region aria-label="Profile" className="w-full max-w-sm" motion={{ events }}>
      <HoverRegion>
        <div className="flex flex-col gap-small">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </HoverRegion>
    </Skeleton.Region>
  );
}
