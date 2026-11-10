import { Badge } from "@/components/core/Badge";

export function BadgeMotionInstantHoverDemo() {
  return (
    <Badge status="info" motion={{ root: { hoverIn: false, hoverOut: false } }}>
      Instant hover
    </Badge>
  );
}
