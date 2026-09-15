import { useMemo, useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function MotionAsyncInterruptDemo() {
  const controller = useMotionControllerHandle();
  const [note, setNote] = useState("onInterrupt / onError");

  const events = useMemo(
    () =>
      createMotionEvents({
        "async:hold": (ctx) => {
          ctx.onInterrupt((reason) => setNote(`interrupted (${reason ?? "killed"})`));
          ctx.onError((error) => setNote(`error: ${error instanceof Error ? error.message : String(error)}`));
          setNote("holding…");
          return ctx.fromRest({ y: -10, duration: 1.2 });
        },
        "async:boom": (ctx) => {
          ctx.onInterrupt(() => setNote("interrupted"));
          ctx.onError((error) => setNote(`error: ${error instanceof Error ? error.message : String(error)}`));
          throw new Error("save failed");
        },
      }),
    [],
  );

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap items-center gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.play("async:hold")}>
          Hold
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.cancel()}>
          Cancel
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.play("async:boom")}>
          Throw
        </Button>
        <Text variant="small" className="text-muted">
          {note}
        </Text>
      </div>
      <Alert
        status="warning"
        title="Interrupt"
        description="Cancel is not failed. Throw calls onError."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
