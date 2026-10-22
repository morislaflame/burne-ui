import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownClassNamesFullDemo() {
  return (
    <Dropdown
      defaultValue="ru"
      classNames={{
        popoverBody: "border border-primary/20",
        subPopover: "shadow-token-lg",
        subPopoverBody: "rounded-large border border-primary/20 bg-tertiary",
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
          <Dropdown.Sub>
            <Dropdown.SubTrigger>More</Dropdown.SubTrigger>
            <Dropdown.SubPopover>
              <Dropdown.Item value="de">
                <Dropdown.ItemIndicator />
                <Dropdown.ItemLabel>Deutsch</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.SubPopover>
          </Dropdown.Sub>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
