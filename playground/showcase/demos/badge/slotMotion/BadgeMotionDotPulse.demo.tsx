import { Badge } from "@/components/core/Badge";

export function BadgeMotionDotPulseDemo() {
  return (
    <Badge
      dot
      status="success"
      aria-label="Live"
      motion={{
        root: {
          hoverIn: { scale: 1.35, duration: 0.28, ease: "back.out(2.4)" },
          hoverOut: { scale: 1, duration: 0.18, ease: "power2.out" },
        },
      }}
    />
  );
}
