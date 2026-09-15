import { useRef } from "react";

import { Button } from "@/components/core/Button";
import { Loading } from "@/components/core/Loading";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "load:hold": { y: -6, duration: 1.2, ease: "power1.inOut", replay: "rest" },
});

export function LoadingMotionControllerSignalDemo() {
  const controller = useMotionControllerHandle();
  const abortRef = useRef<AbortController | null>(null);

  return (
    <div className="flex w-full flex-col items-start gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();
            controller.play("load:hold", { signal: abortRef.current.signal });
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
      <Loading size="large" label="Loading" motionController={controller} motion={{ events }} />
    </div>
  );
}
