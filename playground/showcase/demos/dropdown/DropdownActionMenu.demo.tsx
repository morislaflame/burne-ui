import { IoCopyOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function DropdownActionMenuDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="flex w-full max-w-sm items-center justify-between gap-mid">
      <div className="flex min-w-0 flex-col gap-xsmall">
        <Text as="span" variant="small" className="font-medium">
          Дизайн-система
        </Text>
        <Text as="span" variant="tools" className="text-muted">
          Обновлено 2 ч. назад
        </Text>
      </div>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="ghost" size="small" type="button" aria-label="Действия">
            ···
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="min-w-52">
          <Dropdown.Item value="edit" selection={false}>
            <Dropdown.ItemLabel>Редактировать</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoPencilOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Item value="copy" selection={false}>
            <Dropdown.ItemLabel>Дублировать</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoCopyOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item value="delete" selection={false}>
            <Dropdown.ItemLabel>Удалить</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoTrashOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </Surface>
  );
}
