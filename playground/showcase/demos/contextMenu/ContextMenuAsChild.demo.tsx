import { useLayoutEffect, useRef, useState } from "react";

import { ContextMenu } from "@/components/core/ContextMenu";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function ContextMenuAsChildDemo() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [refLabel, setRefLabel] = useState("ref: —");

  useLayoutEffect(() => {
    const node = triggerRef.current;
    setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
  }, []);

  return (
    <div className="flex flex-col items-center gap-large">
      <Text as="span" variant="small" className="text-muted">
        {refLabel}
      </Text>
      <ContextMenu>
        <ContextMenu.Trigger
          asChild
          ref={triggerRef}
          id="playground-context-menu-trigger"
          data-analytics="open-context-menu"
          className="cursor-context-menu"
        >
          <Surface variant="secondary" padding="large" className="w-full max-w-sm">
            <Text as="span" variant="small" className="font-w-mid">
              Card as trigger
            </Text>
          </Surface>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Open</ContextMenu.Item>
          <ContextMenu.Item>Rename</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
}
