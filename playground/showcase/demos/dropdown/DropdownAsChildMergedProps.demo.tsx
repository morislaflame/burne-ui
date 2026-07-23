import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownAsChildMergedPropsDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [refLabel, setRefLabel] = useState("ref: —");

  useLayoutEffect(() => {
    const node = triggerRef.current;
    setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
  }, []);

  return (
    <div className="flex flex-col items-center gap-large">
      <p className="text-sm text-muted">{refLabel}</p>
      <Dropdown selectionIndicator defaultValue="ru">
        <Dropdown.Trigger
          asChild
          ref={triggerRef}
          id="playground-dropdown-trigger"
          data-analytics="open-dropdown"
          className="ring-2 ring-primary/30"
        >
          <Button variant="outline" type="button">
            Open (merged props)
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
    </div>
  );
}
