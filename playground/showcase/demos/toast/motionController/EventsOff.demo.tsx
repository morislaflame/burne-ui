import { Button } from "@/components/core/Button";
import { Toast } from "@/components/core/Toast";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "toast:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "toast:nudge": false });

export function ToastMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("root", "toast:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("root", "toast:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap gap-xlarge">
      <Toast
        title="Saved"
        description="Standalone card — slots stay live."
        motionController={liveController}
        motion={{ events: live }}
      />
      <Toast
        title="Saved"
        description="Standalone card — slots stay live."
        motionController={offController}
        motion={{ events: off }}
      />
      </div>
    </div>
  );
}
