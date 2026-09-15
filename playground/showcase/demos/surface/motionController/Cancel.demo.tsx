import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "panel:spin": (ctx) =>
    ctx.fromRest({
      y: -6,
      rotation: 1.5,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function SurfaceMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("panel:spin")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("root");
            controller.set("root", { y: 0, rotation: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <Surface
        variant="secondary"
        padding="mid"
        radius="mid"
        className="max-w-xs"
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small">
          cancel() stops the looping run, then set() snaps rest pose.
        </Text>
      </Surface>
    </div>
  );
}
