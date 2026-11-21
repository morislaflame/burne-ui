import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoHeartOutline } from "react-icons/io5";

export function ToggleButtonMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("fill", "check")}>
          playSlot(fill)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("iconStart", "hoverIn")}>
          playSlot(iconStart)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <ToggleButton
        variant="outline"
        icon={<IoHeartOutline aria-hidden />}
        motionController={controller}
        motion={{
          root: {
            pressIn: false,
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          fill: {
            check: "selectionFill",
            uncheck: "selectionFill",
          },
          iconStart: {
            hoverIn: (ctx) => ctx.fromRest({ rotation: 28, duration: 0.24, ease: "back.out(1.8)" }),
            hoverOut: (ctx) => ctx.to({ rotation: 0, duration: 0.18 }),
          },
        }}
      >
        Like
      </ToggleButton>
    </div>
  );
}
