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

export function DialogMotionTitleStaggerDemo() {
  return (
    <MotionDialog
      trigger="Open staggered title"
      title="Staggered title"
      description="Title enters after the panel. Leave returns a tween so the portal can unmount."
      body="Overlay and panel keep the kit modal recipes."
      motion={{
        title: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.35, delay: 0.08 },
            ),
          leave: (ctx) => gsap.to(ctx.el, { y: -8, autoAlpha: 0, duration: 0.2 }),
        },
      }}
    />
  );
}
