import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { PIN_IMAGE1 } from "@/stories-utils/mockImages";

export function BadgeMotionAnchorPopDemo() {
  return (
    <Badge.Anchor
      motion={{
        anchor: {
          hoverIn: { scale: 1.18, y: -6, duration: 0.22 },
          hoverOut: { scale: 1, y: 0, duration: 0.18 },
        },
      }}
    >
      <Avatar size="large" label="Jordan Doe" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Badge status="danger" variant="primary" size="small">
        8
      </Badge>
    </Badge.Anchor>
  );
}
