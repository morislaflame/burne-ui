import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dropdown:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function ItemPulse() {
  const controller = useMotionController();
  return (
    <Dropdown.Item onPointerEnter={() => controller.playSlot("item", "dropdown:nudge")}>
      Hover item
    </Dropdown.Item>
  );
}

export function DropdownMotionControllerInsideDemo() {
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col">
      <Dropdown open>
        <Dropdown.Trigger asChild>
          <Button size="small" variant="outline" type="button">Menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover motion={{ events }}>
          <ItemPulse />
          <Dropdown.Item>Quiet</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
