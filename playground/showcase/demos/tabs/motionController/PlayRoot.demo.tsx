import { Tabs } from "@/components/core/Tabs";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TabsMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play()
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.play("hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Tabs
        defaultValue="one"
        motionController={controller}
        motion={{
          tabText: { hoverIn: false, hoverOut: false, pressIn: false, pressOut: false },
          root: {
            hoverIn: { y: -4, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" className="pt-large">
          <Text as="p" variant="small" className="text-muted">
            play() hits Tabs chrome, not nested Tab scopes.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="two" className="pt-large">
          <Text as="p" variant="small">Second panel.</Text>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
