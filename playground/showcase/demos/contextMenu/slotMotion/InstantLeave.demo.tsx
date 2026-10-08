import { IoCopyOutline, IoCreateOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionInstantLeaveDemo() {
  return (
    <ContextMenu motion={{ content: { leave: false } }}>
      <ContextMenu.Trigger className={surface}>Instant leave</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Rename</ContextMenu.ItemLabel>
          <ContextMenu.ItemIcon>
            <IoCreateOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Copy</ContextMenu.ItemLabel>
          <ContextMenu.ItemIcon>
            <IoCopyOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
