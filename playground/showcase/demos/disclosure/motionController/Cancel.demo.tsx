import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "disclosure:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }),
});

export function DisclosureMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("titleLift", "disclosure:pulse")}>
          Loop
        </Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel("titleLift"); controller.set("titleLift", { y: 0 }); }}>
          Cancel
        </Button>
      </div>
      <Disclosure motionController={controller} motion={{ events }}>
        <Disclosure.Trigger>cancel loop</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">cancel() stops the looping run.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
