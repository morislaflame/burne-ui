import { IoArrowForward, IoMailOutline, IoChatbubbleOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuSubIconDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className={surface}>Right-click</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger icon={<IoArrowForward aria-hidden className="icon-xsmall text-primary" />}>
            Invite
          </ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>
              <ContextMenu.ItemLabel>Email</ContextMenu.ItemLabel>
              <ContextMenu.ItemIcon>
                <IoMailOutline aria-hidden />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.ItemLabel>Message</ContextMenu.ItemLabel>
              <ContextMenu.ItemIcon>
                <IoChatbubbleOutline aria-hidden />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
