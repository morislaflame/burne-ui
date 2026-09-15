import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "listbox:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "listbox:nudge": false });

export function ListBoxMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("header", "listbox:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("header", "listbox:nudge")}>
          Off nudge
        </Button>
      </div>
      <ListBox
        aria-label="Live"
        motionController={liveController}
        motion={{
          item: { pressIn: false, pressOut: false },
          events: live,
        }}
      >
        <ListBox.Header>Live</ListBox.Header>
        <ListBox.Item value="a" label="Events play" />
      </ListBox>
      <ListBox
        aria-label="Off"
        motionController={offController}
        motion={{
          item: { pressIn: false, pressOut: false },
          events: off,
        }}
      >
        <ListBox.Header>Off</ListBox.Header>
        <ListBox.Item value="b" label="events: false skips" />
      </ListBox>
    </div>
  );
}
