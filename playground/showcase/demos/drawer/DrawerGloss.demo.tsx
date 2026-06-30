import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Input } from "@/components/core/Input";

export function DrawerGlossDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button variant="gloss">Gloss Drawer</Button>
        </Drawer.Trigger>
        <Drawer.Panel variant="gloss">
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Gloss Drawer</Drawer.Title>
            <Drawer.Description>Стеклянная боковая панель.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-plus">
          <Input>
            <Input.Label>Заметка</Input.Label>
            <Input.Control variant="gloss" placeholder="Текст…" />
          </Input>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="gloss" onClick={() => setOpen(false)}>
            Закрыть
          </Button>
        </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}
