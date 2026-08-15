import gsap from "gsap";

import { Card } from "@/components/core/Card";

const TL = { overwrite: "auto" as const, force3D: false };

export function CardMotionPressBounceDemo() {
  return (
    <Card
      pressable
      variant="outline"
      className="max-w-xs"
      motion={{
        root: {
          pressIn: (ctx) =>
            gsap.to(ctx.el, {
              scale: 0.94,
              duration: 0.12,
              ease: "power2.out",
              ...TL,
              onComplete: () => {
                gsap.to(ctx.el, { scale: 1, duration: 0.28, ease: "back.out(2.6)", ...TL });
              },
            }),
        },
      }}
    >
      <Card.Header>
        <Card.Title>Press bounce</Card.Title>
        <Card.Description>Custom pressIn — not the kit squeeze recipe.</Card.Description>
      </Card.Header>
    </Card>
  );
}
