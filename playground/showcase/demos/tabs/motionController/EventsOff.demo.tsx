import { Tabs } from "@/components/core/Tabs";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "tabs:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "tabs:nudge": false });

export function TabsMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("tabs:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("tabs:nudge")}>
          Off nudge
        </Button>
      </div>
      <Tabs
        defaultValue="one"
        motionController={liveController}
        motion={{
          tabText: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          events: live,
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="one">Live</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" className="pt-large">
          <Text as="p" variant="small">Events play.</Text>
        </Tabs.Panel>
      </Tabs>
      <Tabs
        defaultValue="one"
        motionController={offController}
        motion={{
          tabText: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          events: off,
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="one">Off</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" className="pt-large">
          <Text as="p" variant="small">events: false skips.</Text>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
