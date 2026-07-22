import { IoArrowForward } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownCustomSubTriggerIconDemo() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline">Menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Sub>
            <Dropdown.SubTrigger
              icon={<IoArrowForward aria-hidden className="icon-xsmall text-primary" />}
            >
              Invite users
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item value="email" selection={false}>
                <Dropdown.ItemLabel>Email</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="msg" selection={false}>
                <Dropdown.ItemLabel>Message</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
