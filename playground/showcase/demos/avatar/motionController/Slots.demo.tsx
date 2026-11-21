import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { PIN_IMAGE2 } from "@/stories-utils/mockImages";

const events = createMotionEvents({
  "presence:pop": {
    scale: 1.16,
    duration: 0.22,
    ease: "back.out(2)",
    replay: "rest",
  },
  "presence:rest": { scale: 1, y: 0, duration: 0.18, ease: "power2.out" },
});

export function AvatarMotionControllerSlotsDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "presence:pop")}>
          Root
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("image", "presence:pop")}>
          Image
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("presence:rest")}>
          Rest
        </Button>
      </div>
      <Avatar
        size="mid"
        label="Grace Hopper"
        src={PIN_IMAGE2}
        alt=""
        loading="lazy"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
