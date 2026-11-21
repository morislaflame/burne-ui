import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "popover:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
function TitlePulse() {
  const controller = useMotionController();
  return (
    <Popover.Title onPointerEnter={() => controller.playSlot("title", "popover:nudge")}>
      Title
    </Popover.Title>
  );
}

export function PopoverMotionControllerInsideDemo() {

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col">
      <Popover open>
        <Popover.Trigger asChild>
          <Button size="small" variant="outline" type="button">
            Open
          </Button>
        </Popover.Trigger>
        <Popover.Content motion={{ events }}>
          <Popover.Header>
            <TitlePulse />
            <Popover.Description>Hover the title.</Popover.Description>
          </Popover.Header>
          <Popover.Body>useMotionController() inside Content.</Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  );
}
