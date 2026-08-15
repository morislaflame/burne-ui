import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";
import type { DialogMotion } from "@/components/core/Dialog";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

function hoverTextColor(el: HTMLElement, color: string, duration = 0.25) {
  if (!el.dataset.motionColorRest) {
    el.dataset.motionColorRest = getComputedStyle(el).color;
  }
  return tweenCssColor(el, color, { duration });
}

function restoreTextColor(el: HTMLElement, duration = 0.2) {
  const rest = el.dataset.motionColorRest || "var(--color-foreground)";
  return tweenCssColor(el, rest, {
    duration,
    clearOnComplete: true,
    onComplete: () => {
      delete el.dataset.motionColorRest;
    },
  });
}

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

export function DialogMotionTitleHoverColorDemo() {
  return (
    <MotionDialog
      trigger="Open hover color"
      title="Hover this title"
      description="Pointer phases on Title. Color uses --color-primary, then restores."
      body="Leave still uses the kit panel recipe."
      motion={{
        title: {
          hoverIn: (ctx) => hoverTextColor(ctx.el, "var(--color-primary)"),
          hoverOut: (ctx) => restoreTextColor(ctx.el),
        },
      }}
    />
  );
}
