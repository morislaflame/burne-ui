import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function AlertDialogMotionBouncePanelDemo() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      motion={{
        panel: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 28, scale: 0.92, autoAlpha: 0 },
              {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.5,
                ease: "back.out(1.4)",
              },
            ),
          leave: {
            y: 24,
            scale: 0.94,
            autoAlpha: 0,
            duration: 0.22,
            ease: "power2.in",
          },
        },
      }}
    >
      <AlertDialog.Trigger asChild>
        <Button variant="primary" type="button">
          Bounce panel
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Bounce</AlertDialog.Title>
            <AlertDialog.Description>panel factory — back.out in, fade out on leave.</AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Body>
          <Text as="p" variant="base">
            Leave must hide the surface (`autoAlpha: 0`) so unmount is not a snap.
          </Text>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Panel>
    </AlertDialog>
  );
}
