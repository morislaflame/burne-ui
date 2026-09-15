import { useMemo, useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { createMotionEvents, isMotionRunActive, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function MotionAsyncWaitDemo() {
  const controller = useMotionControllerHandle();
  const [note, setNote] = useState("ctx.wait — seconds, abortable");

  const events = useMemo(
    () =>
      createMotionEvents({
        "async:hold": async (ctx) => {
          ctx.onInterrupt(() => setNote("skip — run cancelled"));
          setNote("waiting…");
          await ctx.sequence(
            () => ctx.fromRest({ y: -10, duration: 0.16 }),
            () => ctx.wait(0.5),
            () => ctx.to({ y: 0, duration: 0.22 }),
          );
          if (isMotionRunActive(ctx)) setNote("done");
        },
        "async:timeline": (ctx) => {
          ctx.onInterrupt(() => setNote("skip — run cancelled"));
          setNote("timeline.wait…");
          const tl = ctx.timeline();
          tl.fromRest(ctx.el, { y: -10, duration: 0.16 }, 0);
          tl.wait(0.5);
          tl.to(ctx.el, { y: 0, duration: 0.22 });
          tl.eventCallback?.("onComplete", () => setNote("done"));
          return tl;
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
        <Button size="small" variant="outline" onClick={() => void controller.play("async:timeline")}>
          Timeline wait
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.cancel()}>
          Cancel
        </Button>
        <Text variant="small" className="text-muted">
          {note}
        </Text>
      </div>
      <Alert
        status="info"
        title="Wait"
        description='Delay tokens work too: ctx.wait("expand").'
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
