import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { PIN_IMAGE1 } from "@/stories-utils/mockImages";

const events = createMotionEvents({
  "inbox:bump": {
    y: -8,
    scale: 1.08,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power2.out",
  },
});

export function BadgeMotionControllerAnchorDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button
        size="small"
        variant="outline"
        onClick={() => controller.playSlot("anchor", "inbox:bump")}
      >
        Bump Anchor
      </Button>
      <Badge.Anchor
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      >
        <Avatar size="large" label="Jordan Doe" src={PIN_IMAGE1} alt="" loading="lazy" />
        <Badge status="danger" variant="primary" size="small">
          5
        </Badge>
      </Badge.Anchor>
    </div>
  );
}
