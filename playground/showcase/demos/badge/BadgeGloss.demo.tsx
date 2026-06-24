import { IoCheckmark } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";

export function BadgeGlossDemo() {
  return (
    <div className="flex flex-wrap gap-small">
      <Badge variant="gloss">Gloss</Badge>
      <Badge variant="gloss" status="success">
        Success
      </Badge>
      <Badge variant="gloss" icon={<IoCheckmark aria-hidden />}>
        Verified
      </Badge>
    </div>
  );
}
