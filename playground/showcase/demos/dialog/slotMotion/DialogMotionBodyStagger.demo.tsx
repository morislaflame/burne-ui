import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";

export function DialogMotionBodyStaggerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      motion={{
        title: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 10, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.04 },
            ),
          leave: { y: -6, autoAlpha: 0, duration: 0.16 },
        },
        body: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.34, delay: 0.1 },
            ),
          leave: { y: 8, autoAlpha: 0, duration: 0.16 },
        },
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline">Open staggered body</Button>
      </Dialog.Trigger>
      <Dialog.Panel>
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Staggered body</Dialog.Title>
            <Dialog.Description>
              Title enters first. Body follows with a delay. Leave returns a tween so the portal can unmount.
            </Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            Animate `motion.body` independently from `content` and `title`.
          </Text>
        </Dialog.Body>
      </Dialog.Panel>
    </Dialog>
  );
}
