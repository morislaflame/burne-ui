import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function FormMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { exclude: ["title"] })}
        >
          Exclude title
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Form
        aria-label="Exclude title"
        motionController={controller}
        motion={{
          header: {
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          title: {
            hoverIn: { y: -10, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          description: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Form.Header>
          <Form.Title>Should stay put</Form.Title>
          <Form.Description>Description still moves.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}
