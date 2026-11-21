import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CloseButtonMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("icon", "hoverIn")}>
          playSlot(icon)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <CloseButton
        aria-label="play vs playSlot close"
        motionController={controller}
        motion={{
          root: {
            pressIn: false,
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          icon: {
            hoverIn: (ctx) => ctx.fromRest({ rotation: 28, duration: 0.24, ease: "back.out(1.8)" }),
            hoverOut: (ctx) => ctx.to({ rotation: 0, duration: 0.18 }),
          },
        }}
      />
    </div>
  );
}
