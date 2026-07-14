import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Popover } from "@/components/core/Popover";
import { CheckboxGroup, Label } from "@/index";

export function PopoverFilterPanelDemo() {
  const [active, setActive] = useState(false);

  return (
    <Popover open={active} onOpenChange={setActive}>
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Filters
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-56">
        <Popover.Body className="flex flex-col gap-mid p-base">
          <CheckboxGroup 
            selection="single"
          >
            <CheckboxGroup.Legend>
              <Label>
                Status
              </Label>
              <CheckboxGroup.Hint>
                Select display
              </CheckboxGroup.Hint>
            </CheckboxGroup.Legend>
            <CheckboxGroup.List>
              <Checkbox
                label="All"
                name="visible"
                value="all"
              />
              <Checkbox
                label="Drafts only"
                name="visible"
                value="drafts"
              />
            </CheckboxGroup.List>
          </CheckboxGroup>
          <Button size="small" type="button" onClick={() => setActive(false)}>
            Apply
          </Button>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
