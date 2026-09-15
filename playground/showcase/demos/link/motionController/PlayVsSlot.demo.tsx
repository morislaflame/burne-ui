import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

export function LinkMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("text", "hoverIn")}>
          playSlot(text)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
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
          root: {
            pressIn: false,
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          text: {
            hoverIn: { x: 6, duration: 0.22, replay: "rest" },
            hoverOut: { x: 0, duration: 0.16 },
          },
          icon: {
            hoverIn: (ctx) => ctx.fromRest({ rotation: 18, duration: 0.22 }),
            hoverOut: (ctx) => ctx.to({ rotation: 0, duration: 0.18 }),
          },
        }}
      >
        play vs playSlot
      </Link>
    </div>
  );
}
