import { Button } from "@/components/core/Button";
import { Toast } from "@/components/core/Toast";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toast:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function ToastMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "toast:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("root");
            controller.set("root", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <Toast
        title="Saved"
        description="Standalone card — slots stay live."
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
