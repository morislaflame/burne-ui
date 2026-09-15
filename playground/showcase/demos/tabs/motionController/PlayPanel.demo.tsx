import { Tabs } from "@/components/core/Tabs";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TabsMotionControllerPlayPanelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "hoverIn")}>
          playSlot(panel)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("panel", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Tabs
        defaultValue="one"
        motion={{
          tabText: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          value="one"
          className="pt-large"
          motionController={controller}
          motion={{
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          }}
        >
          <Text as="p" variant="small" className="text-muted">
            Nested Panel scope — own handle, playSlot("panel").
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="two" className="pt-large">
          <Text as="p" variant="small">Second panel.</Text>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
