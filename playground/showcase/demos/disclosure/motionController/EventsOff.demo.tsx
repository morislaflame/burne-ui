import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "disclosure:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "disclosure:nudge": false });

export function DisclosureMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("titleLift", "disclosure:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("titleLift", "disclosure:nudge")}>Off</Button>
      </div>
      <Disclosure motionController={liveController} motion={{ events: live }}>
        <Disclosure.Trigger>Live</Disclosure.Trigger>
        <Disclosure.Content><Text as="p" variant="small" className="text-muted">Event plays.</Text></Disclosure.Content>
      </Disclosure>
      <Disclosure motionController={offController} motion={{ events: off }}>
        <Disclosure.Trigger>Off</Disclosure.Trigger>
        <Disclosure.Content><Text as="p" variant="small" className="text-muted">events false → skip.</Text></Disclosure.Content>
      </Disclosure>
    </div>
  );
}
