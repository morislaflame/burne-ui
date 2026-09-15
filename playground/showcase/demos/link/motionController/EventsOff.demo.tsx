import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

const live = createMotionEvents({
  "nav:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "nav:nudge": false });

export function LinkMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("nav:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("nav:nudge")}>
          Off nudge
        </Button>
      </div>
      <Link
        href="#"
        onClick={preventNav}
        underline
        motionController={liveController}
        motion={{ events: live, root: { pressIn: false } }}
      >
        events on
      </Link>
      <Link
        href="#"
        onClick={preventNav}
        underline
        motionController={offController}
        motion={{ events: off, root: { pressIn: false } }}
      >
        events: false
      </Link>
    </div>
  );
}
