import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CheckboxGroupMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { exclude: ["hint"] })}
        >
          Exclude hint
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <CheckboxGroup
        motionController={controller}
        motion={{
          legend: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          hint: {
            hoverIn: { y: -10, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          list: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Plan</CheckboxGroup.Label>
          <CheckboxGroup.Hint>Should stay put</CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="pro" label="Pro" />
          <Checkbox value="team" label="Team" />
        </CheckboxGroup.List>
      </CheckboxGroup>
    </div>
  );
}
