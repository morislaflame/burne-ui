import { useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import {
  MotionGroupProvider,
  useMotionControllerHandle,
  useMotionGroup,
  useMotionGroupHandle,
  useMotionGroupMember,
} from "@/components/core/utils/slotMotion";

const pulse = {
  root: {
    hoverIn: { y: -6, duration: 0.28, replay: "rest" as const },
    hoverOut: { y: 0, duration: 0.2 },
  },
};

function MountedAlert() {
  const group = useMotionGroup();
  const controller = useMotionControllerHandle();
  useMotionGroupMember("alert", controller, group);

  return (
    <Alert
      status="info"
      title="Mounted"
      description="Unregisters on unmount. Later play(id) skips."
      hoverLift={false}
      motionController={controller}
      motion={pulse}
    />
  );
}

export function MotionGroupUnmountDemo() {
  const group = useMotionGroupHandle();
  const [mounted, setMounted] = useState(true);
  const [note, setNote] = useState("member: alert");

  function ping() {
    const run = group.play("alert", "hoverIn");
    setNote(run.status === "cancelled" ? "skip — alert is unregistered" : "played alert");
  }

  return (
    <MotionGroupProvider group={group}>
      <div className="flex flex-col gap-2xlarge">
        <div className="flex flex-wrap items-center gap-small">
          <Button size="small" variant="outline" onClick={() => setMounted((v) => !v)}>
            {mounted ? "Unmount" : "Mount"}
          </Button>
          <Button size="small" variant="ghost" onClick={ping}>
            Play alert
          </Button>
          <Text variant="small" className="text-muted">
            {note}
          </Text>
        </div>
        {mounted ? <MountedAlert /> : null}
      </div>
    </MotionGroupProvider>
  );
}
