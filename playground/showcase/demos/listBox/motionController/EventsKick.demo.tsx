import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "listbox:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -4, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.section) {
      tl.fromRest(ctx.targets.section, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.section) {
      tl.to(ctx.targets.section, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function ListBoxMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "listbox:scan")}>
        Scan
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
