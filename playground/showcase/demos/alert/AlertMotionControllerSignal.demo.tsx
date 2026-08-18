import { useRef } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "wait:hold": { y: -6, duration: 1.2, ease: "power1.inOut", replay: "rest" },
});

export function AlertMotionControllerSignalDemo() {
  const controller = useMotionControllerHandle();
  const abortRef = useRef<AbortController | null>(null);

  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();
            controller.play("wait:hold", { signal: abortRef.current.signal });
          }}
        >
          Hold
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            abortRef.current?.abort();
            controller.set("root", { y: 0 });
          }}
        >
          Abort
        </Button>
      </div>
      <Alert
        status="info"
        title="signal"
        description="External AbortSignal cancels the run; set() snaps back."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
