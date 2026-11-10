import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogMotionChromeSplitDemo() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      motion={{
        header: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: -18, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.34, delay: 0.04, ease: "power3.out" },
            ),
          leave: { y: -10, autoAlpha: 0, duration: 0.14 },
        },
        footer: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 20, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.36, delay: 0.1, ease: "power3.out" },
            ),
          leave: { y: 12, autoAlpha: 0, duration: 0.14 },
        },
      }}
    >
      <AlertDialog.Trigger asChild>
        <Button variant="outline" type="button">
          Chrome split
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Confirm action</AlertDialog.Title>
            <AlertDialog.Description>
              Header enters from above, footer from below. Overlay/panel keep kit recipes.
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
