import { Button } from "@/components/core/Button";
import { AppShell } from "@/components/core/AppShell";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "shell:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "shell:nudge": false });

export function AppShellMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("shell:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("shell:nudge")}>Off</Button>
      </div>
      <AppShell motionController={liveController} motion={{ events: live }}><span>Shell</span></AppShell>
      <AppShell motionController={offController} motion={{ events: off }}><span>Shell</span></AppShell>
    </div>
  );
}
