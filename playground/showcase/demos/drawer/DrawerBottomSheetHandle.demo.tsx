import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

/** Bottom sheet with `Drawer.Handle` — swipe down to dismiss. */
export function DrawerBottomSheetHandleDemo() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(true);

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} placement="bottom">
        <Drawer.Trigger asChild>
          <Button variant="outline">Bottom sheet</Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Handle />
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Quick filters</Drawer.Title>
              <Drawer.Description>Drag the handle down to close.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-mid">
            <Checkbox
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
              label="Drafts only"
            />
            <Text as="p" variant="tools" className="text-muted">
              Typical mobile sheet: handle on top, form in the body.
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
