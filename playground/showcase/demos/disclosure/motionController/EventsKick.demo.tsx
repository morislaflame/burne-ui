import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "disclosure:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.title) tl.fromRest(ctx.targets.title, { x: 6, duration: 0.16 }, 0);
    tl.to(ctx.el, { y: 0, duration: 0.22, ease: "power2.inOut" }, 0.2);
    if (ctx.targets.title) tl.to(ctx.targets.title, { x: 0, duration: 0.22 }, 0.2);
    return tl;
  },
});

export function DisclosureMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("titleLift", "disclosure:scan")}>
        Scan
      </Button>
      <Disclosure motionController={controller} motion={{ events }}>
        <Disclosure.Trigger>ctx.targets</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">Factory on titleLift reaches title via ctx.targets.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
