import { Button } from "@/components/core/Button";
import { Slider } from "@/components/core/Slider";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SliderMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { stagger: 0.1 })}
        >
          Stagger thumbs
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Slider
        range
        label="Range"
        showValue
        defaultValue={[20, 80]}
        motionController={controller}
        motion={{
          thumb: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
