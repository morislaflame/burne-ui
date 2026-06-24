import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverProfileCardDemo() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="ghost" type="button" className="gap-small">
          <Avatar size="small" label="АК" />
          <span>Андрей К.</span>
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow className="w-64">
        <Popover.Arrow />
        <Popover.Header className="px-base pt-base">
          <Popover.Label>Профиль</Popover.Label>
        </Popover.Header>
        <Popover.Body className="flex flex-col gap-mid p-base">
          <div className="flex items-center gap-mid">
            <Avatar size="mid" label="АК" />
            <div className="flex min-w-0 flex-col">
              <Text as="span" variant="small" className="font-medium">
                Андрей К.
              </Text>
              <Text as="span" variant="tools" className="truncate text-muted">
                andrey@example.com
              </Text>
            </div>
          </div>
          <div className="flex flex-col gap-xsmall">
            <Button variant="ghost" size="small" type="button">
              Настройки
            </Button>
            <Button variant="ghost" size="small" type="button">
              Выйти
            </Button>
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
