import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dropdown:up": { y: -6, duration: 0.28, replay: "rest" },
  "dropdown:rest": { y: 0, duration: 0.2 },
});

export function DropdownMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "dropdown:up")}>playSlot(content)</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "dropdown:rest")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("content", { y: 0 })}>Snap</Button>
      </div>
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
