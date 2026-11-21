import { TextPlugin } from "gsap/TextPlugin";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { gsap, registerMotionPlugins } from "@/components/core/utils/gsapMotion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

registerMotionPlugins(TextPlugin);

const REST = "Plugin";
const TYPED = "Typed via plugin";

const events = createMotionEvents({
  "async:type": (ctx) => {
    const title = ctx.getTarget("title");
    if (!title) return;
    const from = title.textContent ?? REST;
    ctx.onCleanup(() => {
      gsap.killTweensOf(title);
    });
    ctx.onInterrupt(() => {
      title.textContent = from;
    });
    if (ctx.reduced) {
      title.textContent = TYPED;
      return;
    }
    return gsap.to(title, { duration: 0.7, text: TYPED, ease: "none" });
  },
});

export function MotionAsyncPluginsDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.play("async:type")}>
          Type title
        </Button>
      </div>
      <Alert
        status="info"
        title={REST}
        description="registerMotionPlugins(TextPlugin) — Flip / ScrollTrigger / Draggable stay app-side, not in the kit bundle."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
