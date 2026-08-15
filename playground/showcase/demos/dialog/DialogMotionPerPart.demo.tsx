import { useState } from "react";
import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";
import type { DialogMotion } from "@/components/core/Dialog";

function MotionDialog({
  trigger,
  title,
  description,
  body,
  motion,
}: {
  trigger: string;
  title: string;
  description: string;
  body: string;
  motion?: DialogMotion;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} motion={motion}>
      <Dialog.Trigger asChild>
        <Button variant="outline">{trigger}</Button>
      </Dialog.Trigger>
      <Dialog.Panel>
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            {body}
          </Text>
        </Dialog.Body>
      </Dialog.Panel>
    </Dialog>
  );
}

export function DialogMotionPerPartDemo() {
  return (
    <MotionDialog
      trigger="Open per-part stagger"
      title="Parts on their own"
      description="Description waits longer. Close scales in from the corner."
      body="Each nested slot is a factory. Leave tweens are required so the portal unmounts."
      motion={{
        title: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 10, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.32, delay: 0.06 },
            ),
          leave: (ctx) => gsap.to(ctx.el, { y: -6, autoAlpha: 0, duration: 0.16 }),
        },
        description: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.36, delay: 0.16 },
            ),
          leave: (ctx) => gsap.to(ctx.el, { y: -4, autoAlpha: 0, duration: 0.14 }),
        },
        close: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { scale: 0.6, rotate: -20, opacity: 0 },
              {
                scale: 1,
                rotate: 0,
                opacity: 1,
                duration: 0.35,
                delay: 0.12,
                ease: "back.out(2)",
                overwrite: "auto",
                force3D: false,
              },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              scale: 0.7,
              autoAlpha: 0,
              duration: 0.14,
              overwrite: "auto",
              force3D: false,
            }),
        },
      }}
    />
  );
}
