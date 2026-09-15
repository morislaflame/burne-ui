import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMotionTriggerPressDemo() {
  return (
    <Dropdown
      motion={{
        trigger: {
          pressIn: (ctx) =>
            ctx.fromTo(
              { scale: 1, rotation: 0 },
              {
                scale: 0.9,
                rotation: -4,
                duration: 0.16,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
              },
            ),
        },
      }}
    >
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Custom trigger press
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Item value="edit" selection={false}>
            <Dropdown.ItemLabel>Edit</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="share" selection={false}>
            <Dropdown.ItemLabel>Share</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
