import { IoCopyOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

const events = createMotionEvents({
  "nav:copied": (ctx) => {
    const tl = ctx.timeline();
    if (ctx.targets.icon) {
      tl.fromRest(ctx.targets.icon, { rotation: -16, scale: 1.16, duration: 0.28, ease: "back.out(1.8)" }, 0);
    }
    if (ctx.targets.text) {
      tl.fromRest(ctx.targets.text, { y: -4, duration: 0.2 }, 0.04);
    }
    return tl;
  },
});

export function LinkMotionEventsCopiedDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("nav:copied")}>
        Copied
      </Button>
      <Link
        href="#"
        onClick={preventNav}
        underline
        icon={<IoCopyOutline aria-hidden />}
        iconPosition="end"
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      >
        Copy permalink
      </Link>
    </div>
  );
}
