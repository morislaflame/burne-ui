import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "toolbar:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "toolbar:nudge": false });

export function ButtonGroupMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("toolbar:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("toolbar:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-large">
        <ButtonGroup aria-label="Live edit" motionController={liveController} motion={{ events: live }}>
          <ButtonGroup.Text>Live</ButtonGroup.Text>
          <Button>Cut</Button>
        </ButtonGroup>
        <ButtonGroup
          aria-label="Off edit"
          variant="outline"
          motionController={offController}
          motion={{ events: off }}
        >
          <ButtonGroup.Text>Off</ButtonGroup.Text>
          <Button>Cut</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
