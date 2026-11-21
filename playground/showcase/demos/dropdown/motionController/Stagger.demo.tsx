import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dropdown:up": { y: -6, duration: 0.22, replay: "rest" },
  "dropdown:rest": { y: 0, duration: 0.16 },
});

export function DropdownMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.playAll("dropdown:up", { stagger: 0.08, exclude: ["content"] })}>Stagger items</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("dropdown:rest")}>Reset</Button>
      </div>
      <Dropdown open>
        <Dropdown.Trigger asChild>
          <Button size="small" variant="outline" type="button">Menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover motionController={controller} motion={{ events }}>
          <Dropdown.Item>Alpha</Dropdown.Item>
          <Dropdown.Item>Beta</Dropdown.Item>
          <Dropdown.Item>Gamma</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
