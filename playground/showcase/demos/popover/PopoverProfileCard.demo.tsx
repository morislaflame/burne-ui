import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";
import { Card } from "@/index";

export function PopoverProfileCardDemo() {
  return (
    <Popover>
      <Popover.Trigger>
          <Card pressable className="p-base w-fit flex items-center gap-base">
              <div className="flex items-center justify-center gap-base">
                <Avatar size="small" label="AK" />
                <span>Andrey K.</span>
              </div>
        </Card>
      </Popover.Trigger>
      <Popover.Content showArrow className="w-64">
        <Popover.Arrow />
        <Popover.Body className="flex flex-col gap-base">
          <div className="flex items-center gap-base">
            <Avatar size="base" label="AK" />
            <div className="flex min-w-0 flex-col">
              <Text as="span" variant="small" className="font-medium">
                Andrey K.
              </Text>
              <Text as="span" variant="tools" className="truncate text-muted">
                andrey@example.com
              </Text>
            </div>
          </div>
          <div className="flex flex-col gap-xsmall">
            <Button variant="outline" size="small" type="button">
              Settings
            </Button>
            <Button variant="primary" status="danger" size="small" type="button">
              Log out
            </Button>
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
