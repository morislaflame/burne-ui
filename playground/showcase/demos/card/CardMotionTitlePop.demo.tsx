import gsap from "gsap";

import { Card } from "@/components/core/Card";

const TL = { overwrite: "auto" as const, force3D: false };

export function CardMotionTitlePopDemo() {
  return (
    <Card pressable className="max-w-xs">
      <Card.Header>
        <Card.Title
          motion={{
            hoverIn: (ctx) =>
              gsap.to(ctx.el, { scale: 1.06, y: -2, duration: 0.22, ease: "back.out(2)", ...TL }),
            hoverOut: (ctx) =>
              gsap.to(ctx.el, { scale: 1, y: 0, duration: 0.16, ease: "power2.out", ...TL }),
          }}
        >
          Title pop
        </Card.Title>
        <Card.Description>Only the title slot scales. Card lift stays default.</Card.Description>
      </Card.Header>
    </Card>
  );
}
