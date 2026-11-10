import { RadioGroup } from "@/components/composite/RadioGroup";
import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { Label } from "@/components/core/Label";

export function RadioGroupMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { stagger: 0.1 })}
        >
          Stagger in
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <RadioGroup
        aria-label="Shipping"
        motionController={controller}
        motion={{
          legend: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          hint: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          list: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <RadioGroup.Legend>
          <Label>Shipping</Label>
          <RadioGroup.Hint>Chrome stagger, not Radio dots.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="ground" label="Ground" />
          <Radio value="air" label="Air" />
        </RadioGroup.List>
      </RadioGroup>
    </div>
  );
}
