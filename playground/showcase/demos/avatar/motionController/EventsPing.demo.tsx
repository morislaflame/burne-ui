import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "presence:ping": { y: -8, scale: 1.08, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function AvatarMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("presence:ping")}>
        Ping
      </Button>
      <Avatar size="mid" label="Ada Lovelace" motionController={controller} motion={{ events }} />
    </div>
  );
}
