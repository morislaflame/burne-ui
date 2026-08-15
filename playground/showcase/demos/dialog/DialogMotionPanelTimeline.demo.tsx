import { useState } from "react";
import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";
import type { DialogMotion } from "@/components/core/Dialog";
import { resolveCssColor } from "@/components/core/utils/gsapMotion";

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

export function DialogMotionPanelTimelineDemo() {
  return (
    <MotionDialog
      trigger="Open panel timeline"
      title="Panel owns the beat"
      description="Title enters as a color + x timeline. Leave: nested slots first, then the panel."
      body="Nested leave is false so the panel factory can drive ctx.targets without a double play."
      motion={{
        panel: {
          enter: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.fromTo(
              ctx.el,
              { scale: 0.9, y: 24, opacity: 0 },
              {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: 0.42,
                ease: "power3.out",
              },
              0,
            );
            return tl;
          },
          leave: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            if (ctx.targets.close) {
              tl.to(ctx.targets.close, { scale: 0.7, autoAlpha: 0, duration: 0.12 }, 0);
            }
            if (ctx.targets.title) {
              tl.to(ctx.targets.title, { x: -12, autoAlpha: 0, duration: 0.16 }, 0.02);
            }
            if (ctx.targets.description) {
              tl.to(ctx.targets.description, { x: -10, autoAlpha: 0, duration: 0.14 }, 0.06);
            }
            tl.to(
              ctx.el,
              {
                scale: 0.94,
                y: 12,
                autoAlpha: 0,
                duration: 0.22,
                ease: "power2.in",
              },
              0.1,
            );
            return tl;
          },
        },
        title: {
          enter: (ctx) => {
            const primary = resolveCssColor(ctx.el, "var(--color-primary)");
            const foreground = resolveCssColor(ctx.el, "var(--color-foreground)");
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.fromTo(
              ctx.el,
              { x: -16, opacity: 0, color: primary },
              {
                x: 0,
                opacity: 1,
                duration: 0.34,
                ease: "power3.out",
              },
              0,
            );
            tl.to(ctx.el, { color: foreground, duration: 0.22 }, 0.18);
            return tl;
          },
          leave: false,
        },
        description: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { x: -12, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.34,
                delay: 0.12,
                ease: "power3.out",
                overwrite: "auto",
                force3D: false,
              },
            ),
          leave: false,
        },
        close: { leave: false },
      }}
    />
  );
}
