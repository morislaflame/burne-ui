import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function DropdownMotionControllerPlayTriggerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("trigger", "hoverIn")}>playSlot(trigger)</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("trigger", "hoverOut")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("trigger", { y: 0 })}>Snap</Button>
      </div>
      <Dropdown motionController={controller} motion={{
        trigger: { hoverIn: { y: -4, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } },
      }}>
        <Dropdown.Trigger asChild>
          <Button size="small" variant="outline" type="button">Root handle</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Item>Menu stays on Popover scope</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
