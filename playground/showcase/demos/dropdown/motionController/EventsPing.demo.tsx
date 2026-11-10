import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dropdown:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function DropdownMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "dropdown:nudge")}>Nudge</Button>
      <Dropdown open>
        <Dropdown.Trigger asChild>
          <Button size="small" variant="outline" type="button">Menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover motionController={controller} motion={{ events }}>
          <Dropdown.Item>Alpha</Dropdown.Item>
          <Dropdown.Item>Beta</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
