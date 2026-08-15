import { useState } from "react";
import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";

export function DialogMotionBouncePanelDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      motion={{
        panel: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 28, scale: 0.92, autoAlpha: 0 },
              {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.5,
                ease: "back.out(1.4)",
                overwrite: "auto",
                force3D: false,
              },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              y: 24,
              scale: 0.94,
              autoAlpha: 0,
              duration: 0.22,
              ease: "power2.in",
              overwrite: "auto",
              force3D: false,
            }),
        },
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="primary" type="button">
          Bounce panel
        </Button>
      </Dialog.Trigger>
      <Dialog.Panel>
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Bounce</Dialog.Title>
            <Dialog.Description>panel factory — back.out in, fade out on leave.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            Leave must hide the surface (`autoAlpha: 0`) so unmount is not a snap.
          </Text>
        </Dialog.Body>
      </Dialog.Panel>
    </Dialog>
  );
}
