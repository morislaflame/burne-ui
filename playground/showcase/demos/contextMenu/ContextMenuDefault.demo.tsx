import { IoClipboardOutline, IoCopyOutline, IoLinkOutline, IoMailOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuDefaultDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className={surface}>Right-click</ContextMenu.Trigger>
      <ContextMenu.Content className="min-w-52">
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Copy</ContextMenu.ItemLabel>
          <ContextMenu.ItemIcon>
            <IoCopyOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Paste</ContextMenu.ItemLabel>
          <ContextMenu.ItemIcon>
            <IoClipboardOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>
              <ContextMenu.ItemLabel>Mail</ContextMenu.ItemLabel>
              <ContextMenu.ItemIcon>
                <IoMailOutline aria-hidden />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.ItemLabel>Copy link</ContextMenu.ItemLabel>
              <ContextMenu.ItemIcon>
                <IoLinkOutline aria-hidden />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
