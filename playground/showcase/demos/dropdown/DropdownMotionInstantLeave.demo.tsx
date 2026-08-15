import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMotionInstantLeaveDemo() {
  return (
    <Dropdown motion={{ content: { leave: false } }}>
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Instant leave
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Item value="edit" selection={false}>
            <Dropdown.ItemLabel>Edit</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="copy" selection={false}>
            <Dropdown.ItemLabel>Duplicate</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
