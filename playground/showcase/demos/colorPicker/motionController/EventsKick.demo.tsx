import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "picker:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.hexInput) {
      tl.fromRest(ctx.targets.hexInput, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.presets) {
      tl.fromRest(ctx.targets.presets, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.hexInput) {
      tl.to(ctx.targets.hexInput, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.presets) {
      tl.to(ctx.targets.presets, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function ColorPickerMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("contentPanel", "picker:kick")}>
        Kick
      </Button>
      <ColorPicker
        open
        defaultValue="#3b82f6"
        motionController={controller}
        motion={{ events }}
      >
        <ColorPicker.Trigger />
        <ColorPicker.Content presets={["#ef4444", "#3b82f6"]} />
      </ColorPicker>
    </div>
  );
}
