import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";

export function DialogMotionInstantPanelDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      motion={{ panel: { enter: false, leave: false } }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline" type="button">
          Instant panel
        </Button>
      </Dialog.Trigger>
      <Dialog.Panel>
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Instant panel</Dialog.Title>
            <Dialog.Description>Panel snaps. Overlay still fades.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            `panel.enter/leave: false` skips scale. Host applies closed state immediately.
          </Text>
        </Dialog.Body>
      </Dialog.Panel>
    </Dialog>
  );
}
