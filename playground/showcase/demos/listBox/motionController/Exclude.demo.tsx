import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ListBoxMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { exclude: ["empty"] })}
        >
          Exclude empty
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <ListBox
        aria-label="Lang"
        motionController={controller}
        motion={{
          item: { pressIn: false, pressOut: false },
          header: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          empty: {
            hoverIn: { y: -10, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          section: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <ListBox.Section>
          <ListBox.Header>Alpha</ListBox.Header>
          <ListBox.Item value="ada" label="Ada" />
          <ListBox.Empty>No more rows</ListBox.Empty>
        </ListBox.Section>
      </ListBox>
    </div>
  );
}
