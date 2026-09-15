import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

const events = createMotionEvents({
  "nav:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function LinkMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("nav:nudge")}>
        Nudge
      </Button>
      <Link
        href="#"
        onClick={preventNav}
        underline
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      >
        nav:nudge
      </Link>
    </div>
  );
}
