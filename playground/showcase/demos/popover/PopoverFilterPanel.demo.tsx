import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverFilterPanelDemo() {
  const [active, setActive] = useState(false);
  const [draft, setDraft] = useState(false);

  return (
    <Popover open={active} onOpenChange={setActive}>
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Фильтры
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-56">
        <Popover.Header className="px-base pt-base">
          <Popover.Label>Статус</Popover.Label>
        </Popover.Header>
        <Popover.Body className="flex flex-col gap-mid p-base">
          <Checkbox
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            label="Только черновики"
          />
          <Text as="p" variant="tools" className="text-muted">
            Popover с формой внутри Body.
          </Text>
          <Button size="small" type="button" onClick={() => setActive(false)}>
            Применить
          </Button>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
