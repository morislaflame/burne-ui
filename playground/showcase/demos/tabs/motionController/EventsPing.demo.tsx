import { Tabs } from "@/components/core/Tabs";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tabs:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function TabsMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("tabs:nudge")}>
        Nudge
      </Button>
      <Tabs
        defaultValue="one"
        motionController={controller}
        motion={{
          tabText: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          events,
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" className="pt-large">
          <Text as="p" variant="small" className="text-muted">
            Root yoyo on the Tabs scope.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="two" className="pt-large">
          <Text as="p" variant="small">Second panel.</Text>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
