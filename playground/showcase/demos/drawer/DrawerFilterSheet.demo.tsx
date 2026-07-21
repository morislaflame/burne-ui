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
          <Button variant="outline">Filters</Button>
        </Drawer.Trigger>
        <Drawer.Panel extent="mid">
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Description>Refine the list selection.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-mid">
          <Checkbox checked={draft} onChange={(e) => setDraft(e.target.checked)} label="Drafts only" />
          <Text as="p" variant="tools" className="text-muted">
            Drawer on the right with the filter form.
          </Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
            Reset
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Apply
          </Button>
        </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}
