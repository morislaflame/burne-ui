import { IoGlobeOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center gap-small rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuClassNamesDemo() {
  return (
    <ContextMenu
      defaultValue="en"
      classNames={{
        trigger: "rounded-large",
        popoverBody: "border border-primary/20",
        subPopoverBody: "rounded-large border border-primary/20 bg-tertiary",
        label: "text-primary",
        item: "rounded-mid",
        itemIcon: "text-primary",
      }}
    >
      <ContextMenu.Trigger className={surface}>
        <IoGlobeOutline aria-hidden className="icon-small" />
        Language
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.Label>Select language</ContextMenu.Label>
          <ContextMenu.Item value="en" selection>
            <ContextMenu.ItemIndicator />
            <ContextMenu.ItemLabel>English</ContextMenu.ItemLabel>
            <ContextMenu.ItemHint>Latin</ContextMenu.ItemHint>
            <ContextMenu.ItemIcon>
              <IoGlobeOutline aria-hidden />
            </ContextMenu.ItemIcon>
          </ContextMenu.Item>
          <ContextMenu.Item value="ru" selection>
            <ContextMenu.ItemIndicator />
            <ContextMenu.ItemLabel>Russian</ContextMenu.ItemLabel>
            <ContextMenu.ItemHint>Cyrillic</ContextMenu.ItemHint>
            <ContextMenu.ItemIcon>
              <IoGlobeOutline aria-hidden />
            </ContextMenu.ItemIcon>
          </ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item value="de" selection>
                <ContextMenu.ItemIndicator />
                <ContextMenu.ItemLabel>Deutsch</ContextMenu.ItemLabel>
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
