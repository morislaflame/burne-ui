import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function FieldMotionControllerPlaySetDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("legend", "hoverIn")}>
          playSlot(legend)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("group", "hoverIn")}>
          playSlot(group)
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Field.Set
        motionController={controller}
        motion={{
          legend: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          group: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Field.Set.Legend>
          <Field.Set.LegendHeader>Contact</Field.Set.LegendHeader>
        </Field.Set.Legend>
        <Field.Set.Group>
          <Field>
            <Field.Label>Name</Field.Label>
          </Field>
        </Field.Set.Group>
      </Field.Set>
    </div>
  );
}
