import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMultipleDemo() {
  return (
    <Dropdown multiple defaultValue={["ru", "en"]}>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Multi-select</Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Item value="ru">
          <Dropdown.ItemIndicator />
          <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
        </Dropdown.Item>
        <Dropdown.Item value="en">
          <Dropdown.ItemIndicator />
          <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
        </Dropdown.Item>
        <Dropdown.Item value="de">
          <Dropdown.ItemIndicator />
          <Dropdown.ItemLabel>Deutsch</Dropdown.ItemLabel>
        </Dropdown.Item>
      </Dropdown.Popover>
    </Dropdown>
  );
}
