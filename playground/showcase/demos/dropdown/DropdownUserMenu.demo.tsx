import { IoLogOutOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { Text } from "@/components/core/Text";

export function DropdownUserMenuDemo() {
  return (
    <Dropdown defaultValue="profile">
      <Dropdown.Trigger asChild>
        <Button variant="outline" leftIcon={<Avatar size="small" label="МИ" />}>
          Аккаунт
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-52">
        <Dropdown.Group>
          <Dropdown.Label>
            <Text as="span" variant="tools" className="text-muted">
              Мария Иванова
            </Text>
          </Dropdown.Label>
          <Dropdown.Item value="profile">
            <Dropdown.ItemLabel>Профиль</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoPersonOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Item value="settings">
            <Dropdown.ItemLabel>Настройки</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoSettingsOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Item value="logout" selection={false}>
            <Dropdown.ItemLabel>Выйти</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoLogOutOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}
