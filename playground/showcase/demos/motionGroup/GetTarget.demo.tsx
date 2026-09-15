import { useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import {
  useMotionControllerHandle,
  useMotionGroupHandle,
  useMotionGroupMember,
} from "@/components/core/utils/slotMotion";

export function MotionGroupGetTargetDemo() {
  const group = useMotionGroupHandle();
  const alert = useMotionControllerHandle();
  useMotionGroupMember("alert", alert, group);
  const [label, setLabel] = useState("title slot: —");

  function liftTitle() {
    const title = group.getTarget("alert", "title");
    setLabel(title ? `title slot: ${title.tagName.toLowerCase()}` : "title slot: missing");
    if (title) group.set("alert", "title", { y: -6 });
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap items-center gap-small">
        <Button size="small" variant="outline" onClick={liftTitle}>
          Lift title
        </Button>
        <Button size="small" variant="ghost" onClick={() => group.set("alert", "title", { y: 0 })}>
          Snap
        </Button>
        <Text variant="small" className="text-muted">
          {label}
        </Text>
      </div>
      <Alert
        status="info"
        title="getTarget(id, slot)"
        description="No querySelector — the child controller owns the node."
        hoverLift={false}
        motionController={alert}
      />
    </div>
  );
}
