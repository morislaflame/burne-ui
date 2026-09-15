import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogMotionHeadingBlockDemo() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
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
      <AlertDialog.Trigger asChild>
        <Button variant="outline" type="button">
          Heading block
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Heading block</AlertDialog.Title>
            <AlertDialog.Description>
              Title + description group enters as one slot.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
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
