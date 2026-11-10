import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function FieldMotionControllerExcludeDemo() {
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
      <Field
        motionController={controller}
        motion={{
          label: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          hint: {
            hoverIn: { y: -10, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          error: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Field.Label>Email</Field.Label>
        <Field.Hint>Should stay put</Field.Hint>
        <Field.Error>Fix this field</Field.Error>
      </Field>
    </div>
  );
}
