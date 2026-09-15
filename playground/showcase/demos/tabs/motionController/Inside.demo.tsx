import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tabs:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function ListPulse() {
  const controller = useMotionController();
  return (
    <Tabs.List onPointerEnter={() => controller.playSlot("list", "tabs:nudge")}>
      <Tabs.Tab value="one">One</Tabs.Tab>
      <Tabs.Tab value="two">Two</Tabs.Tab>
    </Tabs.List>
  );
}

export function TabsMotionControllerInsideDemo() {
  return (
    <Tabs
      defaultValue="one"
      motion={{
        tabText: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
        events,
      }}
    >
      <ListPulse />
      <Tabs.Panel value="one" className="pt-large">
        <Text as="p" variant="small" className="text-muted">
          Hover the list — useMotionController() on the root scope.
        </Text>
      </Tabs.Panel>
      <Tabs.Panel value="two" className="pt-large">
        <Text as="p" variant="small">Second panel.</Text>
      </Tabs.Panel>
    </Tabs>
  );
}
