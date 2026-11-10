import { Expandable } from "@/components/core/Expandable";

export function ExpandableMotionInstantPanelDemo() {
  return (
    <Expandable
      title="No height tween"
      description="Chevron still rotates"
      motion={{ panelShell: { enter: false, leave: false } }}
    >
      <p className="text-small text-muted">Instant open/close; chevron still animates.</p>
    </Expandable>
  );
}
