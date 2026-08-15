import { Expandable } from "@/components/core/Expandable";

export function ExpandableMotionDefaultDemo() {
  return (
    <Expandable title="Default recipes" description="Open — height and chevron">
      <p className="text-small text-muted">Panel uses collapsibleHeight.</p>
    </Expandable>
  );
}
