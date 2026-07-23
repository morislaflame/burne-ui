import { IoLogOutOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { Text } from "@/components/core/Text";

export function DropdownUserMenuDemo() {
  return (
    <Dropdown defaultValue="profile">
      <Dropdown.Trigger asChild>
        <Button variant="secondary">
          <div className="flex items-center justify-center gap-base">
            <Avatar size="small" label="MI" />
            <span>Account</span>
          </div>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-52">
        <Dropdown.Group>
          <Dropdown.Label>
            <Text as="span" variant="xsmall" className="text-muted">
              Maria Ivanova
            </Text>
          </Dropdown.Label>
          <Dropdown.Item value="profile">
            <Dropdown.ItemLabel>Profile</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoPersonOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Item value="settings">
            <Dropdown.ItemLabel>Settings</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoSettingsOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Item value="logout" selection={false}>
            <Dropdown.ItemLabel>Log out</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoLogOutOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
