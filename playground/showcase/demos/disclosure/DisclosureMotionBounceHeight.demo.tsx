import gsap from "gsap";

import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { killMotion } from "@/components/core/utils/gsapMotion";

function innerHeight(ctx: { targets: Record<string, HTMLElement | null> }) {
  return ctx.targets.panelInner?.scrollHeight ?? 0;
}

function releaseOpen(shell: HTMLElement) {
  gsap.set(shell, { clearProps: "height" });
  shell.style.removeProperty("height");
  shell.style.removeProperty("overflow");
}

function lockClosed(shell: HTMLElement) {
  shell.style.height = "0px";
  shell.style.overflow = "hidden";
}

export function DisclosureMotionBounceHeightDemo() {
  return (
    <Disclosure
      className="max-w-lg"
      classNames={{
        root: "border-token-primary overflow-hidden",
        trigger: "bg-primary/5",
        title: "text-primary font-w-strong",
        contentPanel: "border-t border-primary/20 bg-primary/5",
      }}
      motion={{
        contentShell: {
          enter: (ctx) => {
            killMotion(ctx.el);
            ctx.el.style.overflow = "hidden";
            const inner = ctx.targets.panelInner;
            const height = innerHeight(ctx);
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.fromTo(
              ctx.el,
              { height: 0 },
              {
                height,
                duration: 0.55,
                ease: "back.out(1.4)",
                onComplete: () => releaseOpen(ctx.el),
              },
              0,
            );
            if (inner) {
              tl.fromTo(
                inner,
                { y: -10, autoAlpha: 0.2 },
                { y: 0, autoAlpha: 1, duration: 0.32, ease: "power2.out" },
                0.08,
              );
            }
            return tl;
          },
          leave: (ctx) => {
            killMotion(ctx.el);
            const inner = ctx.targets.panelInner;
            const current = ctx.el.getBoundingClientRect().height || innerHeight(ctx);
            ctx.el.style.height = `${current}px`;
            ctx.el.style.overflow = "hidden";
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            if (inner) {
              tl.to(inner, { y: -8, autoAlpha: 0.2, duration: 0.16 }, 0);
            }
            tl.to(
              ctx.el,
              {
                height: 0,
                duration: 0.28,
                ease: "power2.in",
                onComplete: () => lockClosed(ctx.el),
              },
              0.04,
            );
            return tl;
          },
        },
      }}
    >
      <Disclosure.Trigger>Bounce height</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Height still goes 0 → measured, but easing overshoots. Leave must collapse to `0`.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
