import { Card } from "@/components/core/Card";

export function CardMotionPressBounceDemo() {
  return (
    <Card
      pressable
      variant="outline"
      className="max-w-xs"
      motion={{
        root: {
          pressIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { scale: 0.94, duration: 0.12, ease: "power2.out" }, 0);
            tl.to(ctx.el, { scale: 1, duration: 0.28, ease: "back.out(2.6)" }, 0.12);
            return tl;
          },
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
