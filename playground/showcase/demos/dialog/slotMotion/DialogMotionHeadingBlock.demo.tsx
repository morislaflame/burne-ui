import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";

export function DialogMotionHeadingBlockDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      motion={{
        headingBlock: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 10, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3, delay: 0.06 },
            ),
          leave: { y: -6, autoAlpha: 0, duration: 0.14 },
        },
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline">Heading block</Button>
      </Dialog.Trigger>
      <Dialog.Panel>
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Heading block</Dialog.Title>
            <Dialog.Description>
              Title + description group enters as one slot.
            </Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            Animate `motion.headingBlock` independently from `title`.
          </Text>
        </Dialog.Body>
      </Dialog.Panel>
    </Dialog>
  );
}
