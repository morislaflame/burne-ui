import gsap from "gsap";

import { Expandable } from "@/components/core/Expandable";
import { killMotion } from "@/components/core/utils/gsapMotion";

function innerHeight(ctx: { targets: Record<string, HTMLElement | null> }) {
  return ctx.targets.panelInner?.scrollHeight ?? 0;
}

function releaseOpen(shell: HTMLElement) {
  gsap.set(shell, { clearProps: "height,clipPath" });
  shell.style.removeProperty("height");
  shell.style.removeProperty("overflow");
  shell.style.removeProperty("clip-path");
}

function lockClosed(shell: HTMLElement) {
  gsap.set(shell, { clearProps: "clipPath" });
  shell.style.removeProperty("clip-path");
  shell.style.height = "0px";
  shell.style.overflow = "hidden";
}

export function ExpandableMotionClipWipeDemo() {
  return (
    <Expandable
      title="Clip wipe"
      description="panelShell factory — clip-path wipe from the top"
      classNames={{
        root: "border-token-info overflow-hidden",
        trigger: "bg-info/5",
        title: "font-w-strong text-info",
        chevron: "text-info",
        panel: "border-t border-info/20 bg-info/5",
      }}
      motion={{
        panelShell: {
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
              { height: 0, clipPath: "inset(0% 0% 100% 0%)" },
              {
                height,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.42,
                ease: "power3.out",
                onComplete: () => releaseOpen(ctx.el),
              },
              0,
            );
            if (inner) {
              tl.fromTo(
                inner,
                { y: 12, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.28, ease: "power2.out" },
                0.1,
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
              tl.to(inner, { y: 8, autoAlpha: 0, duration: 0.16 }, 0);
            }
            tl.to(
              ctx.el,
              {
                height: 0,
                clipPath: "inset(0% 0% 100% 0%)",
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
      <p className="text-small text-muted">
        Not the kit height recipe — the shell wipes open with clip-path. Closed state still uses height: 0.
      </p>
    </Expandable>
  );
}
