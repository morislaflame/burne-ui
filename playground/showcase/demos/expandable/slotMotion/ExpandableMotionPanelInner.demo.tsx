import gsap from "gsap";
import { IoInformationCircleOutline } from "react-icons/io5";

import { Expandable } from "@/components/core/Expandable";

export function ExpandableMotionPanelInnerDemo() {
  return (
    <Expandable
      defaultOpen
      title="Staggered panel inner"
      description="Open — chevron overshoots, body slides in"
      icon={<IoInformationCircleOutline aria-hidden />}
      classNames={{
        root: "border-token-primary overflow-hidden",
        trigger: "bg-primary/5",
        title: "text-primary font-w-strong",
        description: "text-foreground/70",
        chevron: "text-primary",
        panel: "border-t border-primary/20 bg-primary/5",
      }}
      motion={{
        chevron: {
          enter: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.to(
              ctx.el,
              { rotation: 180, duration: 0.48, ease: "back.out(1.8)" },
              0,
            );
            if (ctx.targets.panelInner) {
              tl.fromTo(
                ctx.targets.panelInner,
                { y: -8, opacity: 0.25 },
                { y: 0, opacity: 1, duration: 0.32, ease: "power2.out" },
                0.06,
              );
            }
            return tl;
          },
          leave: (ctx) => {
            const tl = gsap.timeline({
              defaults: { overwrite: "auto", force3D: false },
            });
            tl.to(ctx.el, { rotation: 0, duration: 0.28 }, 0);
            if (ctx.targets.panelInner) {
              tl.to(
                ctx.targets.panelInner,
                { y: -6, autoAlpha: 0.25, duration: 0.18 },
                0,
              );
            }
            return tl;
          },
        },
      }}
    >
      <p className="text-small text-muted">
        panelShell keeps collapsibleHeight. The chevron factory reaches panelInner via ctx.targets.
      </p>
    </Expandable>
  );
}
