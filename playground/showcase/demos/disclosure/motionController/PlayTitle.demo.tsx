import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function DisclosureMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("titleLift", "hoverIn")}>
          playSlot(titleLift)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("titleLift", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("titleLift", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Disclosure motionController={controller} motion={{ titleLift: { hoverIn: { y: -6, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } } }}>
        <Disclosure.Trigger>Title lift</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">No root slot — playSlot on titleLift.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
