import { Button } from "@/components/core/Button";
import { Loading } from "@/components/core/Loading";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function LoadingMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col items-start gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("spinner", "hoverIn")}>
          playSlot(spinner)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Loading
        size="large"
        label="Loading"
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          spinner: {
            hoverIn: (ctx) => ctx.fromRest({ opacity: 0.4, duration: 0.22 }),
            hoverOut: (ctx) => ctx.to({ opacity: 1, duration: 0.16 }),
          },
        }}
      />
    </div>
  );
}
