import { Button } from "@/components/core/Button";
import { Slider } from "@/components/core/Slider";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SliderMotionControllerPlayChromeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "hoverIn")}>
          playSlot(label)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("value", "hoverIn")}>
          playSlot(value)
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Slider
        showValue
        motionController={controller}
        motion={{
          label: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          value: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Slider.Header>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
        </Slider.Header>
        <Slider.Track defaultValue={55} />
      </Slider>
    </div>
  );
}
