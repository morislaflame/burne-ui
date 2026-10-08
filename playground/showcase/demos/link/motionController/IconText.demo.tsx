import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

export function LinkMotionControllerIconTextDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("iconEnd", "hoverIn")}>
          Icon
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("text", "hoverIn")}>
          Text
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Link
        href="#"
        onClick={preventNav}
        underline
        showDefaultIcon
        motionController={controller}
        motion={{
          root: { pressIn: false },
          text: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          iconEnd: {
            hoverIn: (ctx) => ctx.fromRest({ rotation: 22, duration: 0.24, ease: "back.out(1.8)" }),
            hoverOut: (ctx) => ctx.to({ rotation: 0, duration: 0.18 }),
          },
        }}
      >
        Changelog
      </Link>
    </div>
  );
}
