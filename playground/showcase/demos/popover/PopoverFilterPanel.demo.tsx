import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Popover } from "@/components/core/Popover";
import { CheckboxGroup, Label } from "@/index";

export function PopoverFilterPanelDemo() {
  const [active, setActive] = useState(false);

  return (
    <Popover open={active} onOpenChange={setActive}>
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Фильтры
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-56">
        <Popover.Body className="flex flex-col gap-mid p-base">
          <CheckboxGroup 
            selection="single"
          >
            <CheckboxGroup.Legend>
              <Label>
                Статус
              </Label>
              <CheckboxGroup.Hint>
                Выберите отображение
              </CheckboxGroup.Hint>
            </CheckboxGroup.Legend>
            <CheckboxGroup.List>
              <Checkbox
                label="Все"
                name="visible"
                value="all"
              />
              <Checkbox
                label="Только черновики"
                name="visible"
                value="drafts"
              />
            </CheckboxGroup.List>
          </CheckboxGroup>
          <Button size="small" type="button" onClick={() => setActive(false)}>
            Применить
          </Button>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
