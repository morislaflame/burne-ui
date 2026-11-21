import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function FieldMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.play("hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Field
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -4, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <Field.Label>Email</Field.Label>
        <Field.Hint>Does not steal child Input motion.</Field.Hint>
      </Field>
    </div>
  );
}
