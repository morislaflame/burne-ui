import { Button } from "@/components/core/Button";
import { Container } from "@/components/core/Container";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "container:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ContainerMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" onClick={() => controller.play("container:nudge")}>Nudge</Button>
      <Container maxWidth="mid" padding="mid" motionController={controller} motion={{ events }}>
        <span>Nudge</span>
      </Container>
    </div>
  );
}
