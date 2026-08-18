import { Button } from "@/components/core/Button";

export function ButtonMotionWiggleDemo() {
  return (
    <Button
      variant="secondary"
      motion={{
        root: {
          hoverIn: (ctx) =>
            ctx.to({
              rotate: 2,
              duration: 0.28,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            }),
          hoverOut: (ctx) =>
            ctx.to({
              rotate: 0,
              duration: 0.18,
            }),
        },
      }}
    >
      Wiggle hover
    </Button>
  );
}
