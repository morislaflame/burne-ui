import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMotionSubInstantDemo() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Submenu instant
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Invite</Dropdown.SubTrigger>
            <Dropdown.SubContent motion={{ enter: false, leave: false }}>
              <Dropdown.Item value="email" selection={false}>
                <Dropdown.ItemLabel>Email</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="link" selection={false}>
                <Dropdown.ItemLabel>Copy link</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
