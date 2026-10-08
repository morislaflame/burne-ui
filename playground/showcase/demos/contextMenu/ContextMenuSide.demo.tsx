import { IoLanguageOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center gap-small rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuSideDemo() {
  return (
    <ContextMenu defaultValue="en">
      <ContextMenu.Trigger className={surface}>
        <IoLanguageOutline aria-hidden className="icon-small" />
        Language
      </ContextMenu.Trigger>
      <ContextMenu.Content side="top" className="min-w-44">
        <ContextMenu.Label>Interface</ContextMenu.Label>
        <ContextMenu.Item value="en" selection>
          <ContextMenu.ItemIndicator />
          <ContextMenu.ItemLabel>English</ContextMenu.ItemLabel>
        </ContextMenu.Item>
        <ContextMenu.Item value="ru" selection>
          <ContextMenu.ItemIndicator />
          <ContextMenu.ItemLabel>Russian</ContextMenu.ItemLabel>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
