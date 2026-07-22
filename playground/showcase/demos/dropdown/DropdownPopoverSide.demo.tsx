import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownPopoverSideDemo() {
  return (
    <Dropdown selectionIndicator defaultValue="ru">
      <Dropdown.Trigger asChild>
        <Button variant="outline">Language</Button>
      </Dropdown.Trigger>
      <Dropdown.Popover side="top">
        <Dropdown.Group>
          <Dropdown.Label>Interface</Dropdown.Label>
          <Dropdown.Item value="ru">
            <Dropdown.ItemIndicator />
            <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="en">
            <Dropdown.ItemIndicator />
            <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
