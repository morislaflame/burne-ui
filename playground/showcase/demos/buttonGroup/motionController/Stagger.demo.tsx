import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ButtonGroupMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
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
      <ButtonGroup
        aria-label="Edit"
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          text: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <ButtonGroup.Text>Edit</ButtonGroup.Text>
        <Button>Cut</Button>
        <Button>Copy</Button>
      </ButtonGroup>
    </div>
  );
}
