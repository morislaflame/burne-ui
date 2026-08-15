import { useState } from "react";
import gsap from "gsap";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogMotionOverlayHoldDemo() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      motion={{
        overlay: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { opacity: 0 },
              { opacity: 1, duration: 0.55, ease: "power1.out", overwrite: "auto" },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              opacity: 0,
              duration: 0.42,
              delay: 0.06,
              ease: "power1.in",
              overwrite: "auto",
            }),
        },
      }}
    >
      <AlertDialog.Trigger asChild>
        <Button variant="outline" type="button">
          Overlay hold
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Scrim lingers</AlertDialog.Title>
            <AlertDialog.Description>
              Overlay is its own slot. Panel still uses `modalPanel*`; scrim fades slower and later.
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
