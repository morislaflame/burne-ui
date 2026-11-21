import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function FormMotionControllerDemo() {
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
      <Form
        aria-label="Profile chrome"
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -4, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <Form.Header>
          <Form.Title>Profile</Form.Title>
          <Form.Description>Form scope, not Input.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}
