import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ListBoxMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "hoverIn")}>
          playSlot(header)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("header", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ListBox
        aria-label="Lang"
        motionController={controller}
        motion={{
          item: { pressIn: false, pressOut: false },
          header: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <ListBox.Section>
          <ListBox.Header>Alpha</ListBox.Header>
          <ListBox.Item value="ada" label="Ada" />
          <ListBox.Separator />
          <ListBox.Item value="lin" label="Lin" />
        </ListBox.Section>
        <ListBox.Section>
          <ListBox.Header>Beta</ListBox.Header>
          <ListBox.Item value="sam" label="Sam" />
        </ListBox.Section>
      </ListBox>
    </div>
  );
}
