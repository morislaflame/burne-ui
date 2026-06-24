import { IoCheckmark } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";

export function BadgeVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-small">
      <Badge>Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge status="success" icon={<IoCheckmark aria-hidden />}>
        Success
      </Badge>
      <Badge status="danger">Danger</Badge>
      <Badge status="info">Info</Badge>
      <Badge status="warning">Warning</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
