import gsap from "gsap";

import { Expandable } from "@/components/core/Expandable";

export function ExpandableMotionChevronDemo() {
  return (
    <Expandable>
      <Expandable.Trigger>
        <Expandable.Title>Compound chevron</Expandable.Title>
        <Expandable.Chevron
          motion={{
            enter: (ctx) =>
              gsap.to(ctx.el, {
                rotation: 180,
                duration: 0.45,
                ease: "back.out(1.6)",
                overwrite: "auto",
                force3D: false,
              }),
            leave: (ctx) =>
              gsap.to(ctx.el, {
                rotation: 0,
                duration: 0.28,
                overwrite: "auto",
                force3D: false,
              }),
          }}
        />
      </Expandable.Trigger>
      <Expandable.Panel>
        <p className="text-small text-muted">Custom chevron easing via the part prop.</p>
      </Expandable.Panel>
    </Expandable>
  );
}
