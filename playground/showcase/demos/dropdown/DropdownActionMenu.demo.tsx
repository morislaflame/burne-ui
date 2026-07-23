import { IoCopyOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function DropdownActionMenuDemo() {
  return (
    <Surface variant="secondary" padding="large" className="flex w-full max-w-sm items-center justify-between gap-large">
      <div className="flex min-w-0 flex-col gap-xsmall">
        <Text as="span" variant="small" className="font-medium">
          Design system
        </Text>
        <Text as="span" variant="xsmall" className="text-muted">
          Updated 2 hours ago
        </Text>
      </div>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="ghost" size="small" type="button" aria-label="Actions">
            ···
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="min-w-52">
          <Dropdown.Item value="edit" selection={false}>
            <Dropdown.ItemLabel>Edit</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoPencilOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Item value="copy" selection={false}>
            <Dropdown.ItemLabel>Duplicate</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoCopyOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item value="delete" selection={false}>
            <Dropdown.ItemLabel>Delete</Dropdown.ItemLabel>
            <Dropdown.ItemIcon>
              <IoTrashOutline aria-hidden />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </Surface>
  );
}
