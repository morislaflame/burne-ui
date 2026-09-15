import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function AlertDialogMotionBodyStaggerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
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
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Open staggered body</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Staggered body</AlertDialog.Title>
            <AlertDialog.Description>Body follows the title on enter.</AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Body>
          <Text as="p" variant="base">
            `motion.body` is the scroll area, separate from `content`.
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
