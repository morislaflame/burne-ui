import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function FormMotionControllerPlayFieldDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("field", "hoverIn")}>
          playSlot(field)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("field", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("field", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Form aria-label="Nested field scope">
        <Form.Field
          name="note"
          motionController={controller}
          motion={{
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          }}
        >
          <Text as="p" variant="small">
            Nested Form.Field scope — not the Form root, not Input.
          </Text>
        </Form.Field>
      </Form>
    </div>
  );
}
