import { useState } from "react";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

const NOTIFICATIONS = [
  { title: "New comment", time: "2 min" },
  { title: "Deployment complete", time: "1 h" },
  { title: "Invitation to the team", time: "yesterday" },
] as const;

export function DrawerNotificationPanelDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>

      <Drawer open={open} onOpenChange={setOpen} placement="right">
        <Drawer.Trigger asChild>
          <Button variant="outline">
            Notifications
            <Badge size="small" className="ml-xsmall">
              3
            </Badge>
          </Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Notifications</Drawer.Title>
            <Drawer.Description>Latest events</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-mid">
          {NOTIFICATIONS.map((item) => (
            <div key={item.title} className="flex flex-col gap-xsmall rounded-base border-token px-plus py-small">
              <Text as="span" variant="small" className="font-medium">
                {item.title}
              </Text>
              <Text as="span" variant="tools" className="text-muted">
                {item.time}
              </Text>
            </div>
          ))}
        </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}
