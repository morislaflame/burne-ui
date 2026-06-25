import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";

export function BadgeInboxButtonDemo() {
  return (
    <Badge.Anchor>
      <Button variant="outline" leftIcon={<span aria-hidden>📬</span>}>
        Входящие
      </Button>
      <Badge status="danger" variant="primary" size="small" placement="top-right">
        12
      </Badge>
    </Badge.Anchor>
  );
}
