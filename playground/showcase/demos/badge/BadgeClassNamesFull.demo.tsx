import { IoRocketOutline } from "react-icons/io5";

import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";

export function BadgeClassNamesFullDemo() {
  return (
    <div className="flex flex-col items-start gap-mid">
      <div className="flex flex-wrap items-center gap-plus">
        <Badge
          status="info"
          classNames={{
            root: "rounded-large border-info/50",
            text: "bg-info/10 text-info",
          }}
        >
          text slot
        </Badge>
        <Badge
          iconOnly
          icon={<IoRocketOutline aria-hidden />}
          aria-label="icon-only slot"
          classNames={{
            root: "rounded-large",
            iconOnly: "bg-success/15 text-success border-success/40",
          }}
        />
        <Badge
          dot
          aria-label="dot slot"
          classNames={{
            dot: "bg-warning ring-2 ring-background border-0",
          }}
        />
      </div>

      <Badge.Anchor
        classNames={{
          anchor: "rounded-full ring-2 ring-primary/30 p-1",
          root: "rounded-full",
          dot: "ring-2 ring-background",
        }}
      >
        <Avatar size="base" label="Demo user" />
        <Badge dot status="success" aria-label="online" />
      </Badge.Anchor>
    </div>
  );
}
