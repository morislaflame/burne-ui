import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toolbar:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -8, duration: 0.18, ease: "power2.out" }, 0);
    if (ctx.targets.text) {
      tl.fromRest(ctx.targets.text, { y: -6, duration: 0.22, ease: "back.out(1.7)" }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.32);
    if (ctx.targets.text) {
      tl.to(ctx.targets.text, { y: 0, duration: 0.2, ease: "power2.inOut" }, 0.32);
    }
    return tl;
  },
});

export function ButtonGroupMotionEventsScanDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("toolbar:scan")}>
        Scan
      </Button>
      <ButtonGroup aria-label="Edit" motionController={controller} motion={{ events }}>
        <ButtonGroup.Text>Edit</ButtonGroup.Text>
        <Button>Cut</Button>
        <Button>Copy</Button>
      </ButtonGroup>
    </div>
  );
}
