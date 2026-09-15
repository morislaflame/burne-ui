import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dismiss:spin": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { rotation: -8, duration: 0.18 }, 0);
    if (ctx.targets.icon) {
      tl.fromRest(ctx.targets.icon, { rotation: 90, scale: 1.12, duration: 0.32, ease: "back.out(1.7)" }, 0);
    }
    return tl;
  },
});

export function CloseButtonMotionEventsSpinDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("dismiss:spin")}>
        Spin
      </Button>
      <CloseButton
        aria-label="dismiss spin close"
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      />
    </div>
  );
}
