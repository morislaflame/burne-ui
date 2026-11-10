import { Badge } from "@/components/core/Badge";

export function BadgeMotionRootTiltDemo() {
  return (
    <Badge
      variant="secondary"
      motion={{
        root: {
          hoverIn: (ctx) =>
            ctx.to({ rotation: -8, y: -2, duration: 0.22, ease: "power2.out" }),
          hoverOut: (ctx) =>
            ctx.to({ rotation: 0, y: 0, duration: 0.18, ease: "power2.out" }),
        },
      }}
    >
      Root tilt
    </Badge>
  );
}
