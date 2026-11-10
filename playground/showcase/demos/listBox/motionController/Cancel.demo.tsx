import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "listbox:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function ListBoxMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "listbox:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("header");
            controller.set("header", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
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
