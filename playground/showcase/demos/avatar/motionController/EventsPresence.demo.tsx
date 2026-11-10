import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "presence:online": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { scale: 1.12, duration: 0.22, ease: "back.out(2)" }, 0);
    tl.to(ctx.el, { y: -8, duration: 0.18, ease: "power2.out" }, 0.06);
    tl.to(ctx.el, { y: 0, scale: 1, duration: 0.24, ease: "power2.inOut" }, 0.28);
    return tl;
  },
});

export function AvatarMotionEventsPresenceDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("presence:online")}>
        Online
      </Button>
      <Avatar size="mid" label="Ada Lovelace" motionController={controller} motion={{ events }} />
    </div>
  );
}
