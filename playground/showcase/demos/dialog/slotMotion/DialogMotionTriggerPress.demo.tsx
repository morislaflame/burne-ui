import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";

export function DialogMotionTriggerPressDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      motion={{
        trigger: {
          pressIn: (ctx) =>
            ctx.fromTo(
              { scale: 1, y: 0 },
              {
                scale: 0.88,
                y: 3,
                duration: 0.16,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
              },
            ),
        },
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline">Custom trigger press</Button>
      </Dialog.Trigger>
      <Dialog.Panel>
        <Dialog.Header>
          <Dialog.Title>Trigger recipe</Dialog.Title>
          <Dialog.Description>
            Open squeeze uses `motion.trigger.pressIn` instead of kit `pressSqueeze`.
          </Dialog.Description>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            Pass a factory or another recipe name. `pressIn: false` skips the squeeze.
          </Text>
        </Dialog.Body>
      </Dialog.Panel>
    </Dialog>
  );
}
