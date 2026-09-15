import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMotionSeparatorDemo() {
  return (
    <Dropdown
      motion={{
        separator: {
          enter: (ctx) =>
            ctx.fromTo(
              { scaleX: 0.4, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 0.24, delay: 0.06 },
            ),
        },
      }}
    >
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Separator enter
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Item value="edit" selection={false}>
            <Dropdown.ItemLabel>Edit</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item value="delete" selection={false} status="danger">
            <Dropdown.ItemLabel>Delete</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
