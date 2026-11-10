import { Button } from "@/components/core/Button";
import { Container } from "@/components/core/Container";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "container:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "container:nudge": false });

export function ContainerMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("container:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("container:nudge")}>Off</Button>
      </div>
      <Container maxWidth="mid" padding="mid" motionController={liveController} motion={{ events: live }}><span>Live</span></Container>
      <Container maxWidth="mid" padding="mid" motionController={offController} motion={{ events: off }}><span>Off</span></Container>
    </div>
  );
}
