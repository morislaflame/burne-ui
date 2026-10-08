import { IoArchiveOutline, IoCopyOutline, IoCreateOutline, IoTrashOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";
import { Text } from "@/components/core/Text";

const surface =
  "min-h-control-large w-full max-w-sm items-center justify-between rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuActionsDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className={surface}>
        <span className="flex min-w-0 flex-col items-start gap-xsmall">
          <Text as="span" variant="small" className="font-w-mid">
            Design notes
          </Text>
          <Text as="span" variant="xsmall" className="text-muted">
            Right-click the file
          </Text>
        </span>
      </ContextMenu.Trigger>
      <ContextMenu.Content className="min-w-52">
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Rename</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>Change the title</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoCreateOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Duplicate</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>Make a copy</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoCopyOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Archive</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>Hide from the list</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoArchiveOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item status="danger">
          <ContextMenu.ItemLabel>Delete</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>No undo</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoTrashOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
