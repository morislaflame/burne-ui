import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "listbox:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ListBoxMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "listbox:nudge")}>
        Nudge
      </Button>
      <ListBox
        aria-label="Lang"
        motionController={controller}
        motion={{
          item: { pressIn: false, pressOut: false },
          events,
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
