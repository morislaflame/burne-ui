import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "disclosure:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function DisclosureMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("titleLift", "disclosure:nudge")}>
        Nudge
      </Button>
      <Disclosure motionController={controller} motion={{ events }}>
        <Disclosure.Trigger>disclosure:nudge</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">Namespaced event — not open/close.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
