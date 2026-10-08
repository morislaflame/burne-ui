import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function DialogInteractOutsideDemo() {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(true);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="outline">Unsaved form</Button>
        </Dialog.Trigger>
        <Dialog.Panel
          onInteractOutside={(event) => {
            if (dirty) event.preventDefault();
          }}
        >
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Unsaved changes</Dialog.Title>
              <Dialog.Description>
                Backdrop click calls onInteractOutside. preventDefault keeps the dialog open.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <Switch
              label="Treat form as dirty"
              hint="On — backdrop does not close. Off — overlay dismisses as usual."
              checked={dirty}
              onChange={(e) => setDirty(e.target.checked)}
            />
            <Text as="p" variant="small" className="mt-mid text-muted">
              Returning false from the handler does nothing — only preventDefault().
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Discard
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
