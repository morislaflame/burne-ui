import gsap from "gsap";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

const tween = { overwrite: "auto" as const, force3D: false };

export function ContextMenuMotionOriginScaleDemo() {
  return (
    <ContextMenu
      motion={{
        content: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { scale: 0.86, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.28,
                ease: "power3.out",
                transformOrigin: "0% 0%",
                ...tween,
              },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              scale: 0.9,
              autoAlpha: 0,
              duration: 0.16,
              ease: "power2.in",
              transformOrigin: "0% 0%",
              ...tween,
            }),
        },
      }}
    >
      <ContextMenu.Trigger className={surface}>From the pointer</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Open</ContextMenu.Item>
        <ContextMenu.Item>Rename</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
