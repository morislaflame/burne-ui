import { Badge } from "@/components/core/Badge";

export function BadgeSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-large">
      <Badge size="small">Small</Badge>
      <Badge size="base">Base</Badge>
      <Badge size="mid">Mid</Badge>
      <Badge size="large">Large</Badge>
    </div>
  );
}
