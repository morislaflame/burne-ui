import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownPortalContainerDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <p className="text-sm text-muted">
        Custom <code className="text-foreground">portalContainer</code> — menu mounts into the host.
      </p>
      <div
        ref={setContainer}
        className="relative flex h-64 items-start justify-center overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-mid"
      >
        <p className="absolute left-mid top-mid text-xs text-muted">Custom portal host</p>
        {container ? (
          <Dropdown portalContainer={container} selectionIndicator defaultValue="ru">
            <Dropdown.Trigger asChild>
              <Button variant="outline" type="button">
                Open in host
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Group>
                <Dropdown.Label>Language</Dropdown.Label>
                <Dropdown.Item value="ru">
                  <Dropdown.ItemIndicator />
                  <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
                </Dropdown.Item>
                <Dropdown.Item value="en">
                  <Dropdown.ItemIndicator />
                  <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
                </Dropdown.Item>
              </Dropdown.Group>
            </Dropdown.Popover>
          </Dropdown>
        ) : null}
      </div>
    </div>
  );
}
