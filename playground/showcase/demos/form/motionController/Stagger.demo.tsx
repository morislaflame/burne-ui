import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function FormMotionControllerStaggerDemo() {
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
      <Form
        aria-label="Stagger chrome"
        motionController={controller}
        motion={{
          header: {
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          title: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          description: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          actions: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <Form.Header>
          <Form.Title>Profile</Form.Title>
          <Form.Description>Chrome slots only.</Form.Description>
        </Form.Header>
        <Form.Actions>
          <Button type="button" size="small" variant="outline">
            Save
          </Button>
        </Form.Actions>
      </Form>
    </div>
  );
}
