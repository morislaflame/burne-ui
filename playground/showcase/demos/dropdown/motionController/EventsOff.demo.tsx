import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "dropdown:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "dropdown:nudge": false });

export function DropdownMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("content", "dropdown:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("content", "dropdown:nudge")}>Off</Button>
      </div>
      <div className="flex flex-wrap gap-xlarge">
        <Dropdown open>
          <Dropdown.Trigger asChild>
            <Button size="small" variant="outline" type="button">Live</Button>
          </Dropdown.Trigger>
          <Dropdown.Popover motionController={liveController} motion={{ events: live }}>
            <Dropdown.Item>Alpha</Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>
        <Dropdown open>
          <Dropdown.Trigger asChild>
            <Button size="small" variant="outline" type="button">Off</Button>
          </Dropdown.Trigger>
          <Dropdown.Popover motionController={offController} motion={{ events: off }}>
            <Dropdown.Item>Alpha</Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
}
