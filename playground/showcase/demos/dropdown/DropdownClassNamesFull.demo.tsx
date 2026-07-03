import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownClassNamesFullDemo() {
  return (
    <Dropdown
      selectionIndicator
      defaultValue="ru"
      classNames={{
        popoverBody: "border border-primary/20",
        label: "text-primary",
        item: "rounded-lg",
      }}
    >
      <Dropdown.Trigger asChild>
        <Button variant="outline">Interface language</Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Label>Select language</Dropdown.Label>
          <Dropdown.Item value="ru">
            <Dropdown.ItemIndicator />
            <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
            <Dropdown.ItemHint>Cyrillic</Dropdown.ItemHint>
          </Dropdown.Item>
          <Dropdown.Item value="en">
            <Dropdown.ItemIndicator />
            <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
            <Dropdown.ItemHint>Latin</Dropdown.ItemHint>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
