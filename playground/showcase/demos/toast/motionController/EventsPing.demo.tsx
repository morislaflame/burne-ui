import { Button } from "@/components/core/Button";
import { Toast } from "@/components/core/Toast";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toast:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ToastMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "toast:nudge")}>
          Nudge
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
