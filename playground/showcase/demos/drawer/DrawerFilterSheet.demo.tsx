import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

export function DrawerFilterSheetDemo() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(true);

  return (
    <>

      <Drawer open={open} onOpenChange={setOpen} placement="right">
        <Drawer.Trigger asChild>
          <Button variant="outline">Фильтры</Button>
        </Drawer.Trigger>
        <Drawer.Panel size="mid">
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Фильтры</Drawer.Title>
            <Drawer.Description>Уточните выборку списка.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-mid">
          <Checkbox checked={draft} onChange={(e) => setDraft(e.target.checked)} label="Только черновики" />
          <Text as="p" variant="tools" className="text-muted">
            Drawer справа с формой фильтрации.
          </Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
            Сбросить
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Применить
          </Button>
        </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}
