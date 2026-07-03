import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";

export function DialogClassNamesFullDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        classNames={{
          panel: "border-primary/40 shadow-token-large",
          header: "border-b border-primary/20 pb-small",
          title: "text-primary font-semibold",
          description: "text-foreground/75",
          footer: "border-t border-primary/20 pt-small",
        }}
      >
        <Dialog.Trigger asChild>
          <Button variant="outline">
            Open from classNames
          </Button>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description>Slots are configured via classNames.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <p className="text-small text-muted">Example body-slots with custom panel styles.</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button size="small" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
