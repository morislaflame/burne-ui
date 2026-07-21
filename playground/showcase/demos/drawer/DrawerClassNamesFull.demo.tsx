import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

export function DrawerClassNamesFullDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        classNames={{
          trigger: "font-medium",
          panel: "border-primary/40 shadow-token-large",
          header: "border-b border-primary/20 pb-small",
          title: "text-primary font-w-strong",
          description: "text-foreground/75",
          footer: "border-t border-primary/20 pt-small",
        }}
      >
        <Drawer.Trigger asChild>
          <Button variant="outline">Open from classNames</Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Settings</Drawer.Title>
            <Drawer.Description>Slots are configured via classNames.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>
          <p className="text-small text-muted">Example body-slots with custom panel styles.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button size="small" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}
