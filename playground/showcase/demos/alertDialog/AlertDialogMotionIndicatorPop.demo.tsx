import { useState } from "react";
import gsap from "gsap";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

const TL = { overwrite: "auto" as const, force3D: false };

export function AlertDialogMotionIndicatorPopDemo() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      status="danger"
      motion={{
        indicator: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { scale: 0.45, rotation: -28, autoAlpha: 0 },
              {
                scale: 1,
                rotation: 0,
                autoAlpha: 1,
                duration: 0.42,
                delay: 0.08,
                ease: "back.out(2.2)",
                ...TL,
              },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              scale: 0.7,
              rotation: 12,
              autoAlpha: 0,
              duration: 0.16,
              ...TL,
            }),
        },
      }}
    >
      <AlertDialog.Trigger asChild>
        <Button variant="outline" type="button">
          Indicator pop
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Delete workspace?</AlertDialog.Title>
            <AlertDialog.Description>
              Status icon is the `indicator` slot — Dialog has no equivalent.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" status="danger" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Panel>
    </AlertDialog>
  );
}
