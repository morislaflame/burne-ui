import { IoHeartOutline, IoNotificationsOutline } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";

export function BadgeSizesDemo() {
  return (
    <div className="flex flex-col gap-large">
      <div className="flex flex-wrap items-center gap-large">
        <Badge size="small">Small</Badge>
        <Badge size="base">Base</Badge>
        <Badge size="mid">Mid</Badge>
        <Badge size="large">Large</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-large">
        <Badge size="small" status="danger" variant="primary">
          3
        </Badge>
        <Badge size="base" status="danger" variant="primary">
          3
        </Badge>
        <Badge size="mid" status="info" variant="primary">
          12
        </Badge>
        <Badge
          size="base"
          status="warning"
          icon={<IoNotificationsOutline aria-hidden />}
          aria-label="Alerts"
        />
        <Badge size="large" status="danger" icon={<IoHeartOutline aria-hidden />} aria-label="Likes" />
      </div>
    </div>
  );
}
