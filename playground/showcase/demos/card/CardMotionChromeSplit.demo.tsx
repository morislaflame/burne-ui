import gsap from "gsap";

import { Card } from "@/components/core/Card";

const TL = { overwrite: "auto" as const, force3D: false };

export function CardMotionChromeSplitDemo() {
  return (
    <Card
      pressable
      variant="outline"
      className="max-w-xs"
      motion={{
        root: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            if (ctx.targets.header) tl.to(ctx.targets.header, { y: -6, duration: 0.22 }, 0);
            if (ctx.targets.footer) tl.to(ctx.targets.footer, { y: 6, duration: 0.22 }, 0);
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            if (ctx.targets.header) tl.to(ctx.targets.header, { y: 0, duration: 0.18 }, 0);
            if (ctx.targets.footer) tl.to(ctx.targets.footer, { y: 0, duration: 0.18 }, 0);
            return tl;
          },
        },
      }}
    >
      <Card.Header>
        <Card.Title>Chrome split</Card.Title>
        <Card.Description>Header up, footer down on hover.</Card.Description>
      </Card.Header>
      <Card.Footer>Footer slot</Card.Footer>
    </Card>
  );
}
