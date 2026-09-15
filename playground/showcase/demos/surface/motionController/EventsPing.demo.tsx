import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "panel:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function SurfaceMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("panel:ping")}>
        Ping
      </Button>
      <Surface
        variant="secondary"
        padding="mid"
        radius="mid"
        className="max-w-xs"
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small">
          `panel:ping` on motion.events — not a hover phase.
        </Text>
      </Surface>
    </div>
  );
}
