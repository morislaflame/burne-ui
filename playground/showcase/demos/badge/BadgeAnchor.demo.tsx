import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { PIN_IMAGE1, PIN_IMAGE3 } from "@/stories-utils/mockImages";

export function BadgeAnchorDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Badge.Anchor>
        <Avatar size="large" label="Jordan Doe" src={PIN_IMAGE1} alt="" loading="lazy" />
        <Badge status="danger" variant="primary" size="small">
          5
        </Badge>
      </Badge.Anchor>
      <Badge.Anchor>
        <Avatar size="large" label="Casey Davis" src={PIN_IMAGE3} alt="" loading="lazy" />
        <Badge status="success" dot placement="bottom-right" size="small" aria-label="Online" />
      </Badge.Anchor>
    </div>
  );
}
