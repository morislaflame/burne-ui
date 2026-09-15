import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ListBoxMotionControllerPlayItemDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("item", "hoverIn")}>
          playSlot(item)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("item", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("item", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ListBox aria-label="Lang">
        <ListBox.Item
          value="ada"
          label="Ada"
          motionController={controller}
          motion={{
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          }}
        />
        <ListBox.Item value="lin" label="Lin" />
      </ListBox>
    </div>
  );
}
