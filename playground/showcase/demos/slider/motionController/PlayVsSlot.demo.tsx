import { Button } from "@/components/core/Button";
import { Slider } from "@/components/core/Slider";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SliderMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "hoverIn")}>
          playSlot(track)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("thumb", "hoverIn")}>
          playSlot(thumb)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Slider
        label="Volume"
        showValue
        defaultValue={55}
        motionController={controller}
        motion={{
          track: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          thumb: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
