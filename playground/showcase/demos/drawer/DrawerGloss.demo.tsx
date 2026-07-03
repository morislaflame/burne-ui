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
            <Drawer.Description>Glass side panel.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-plus">
          <Input>
            <Input.Label>Note</Input.Label>
            <Input.Control variant="gloss" placeholder="Text…" />
          </Input>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="gloss" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}
