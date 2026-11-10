import { Button } from "@/components/core/Button";
import { AppShell } from "@/components/core/AppShell";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "shell:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function AppShellMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" onClick={() => controller.play("shell:nudge")}>Nudge</Button>
      <AppShell motionController={controller} motion={{ events }}><span>Shell</span></AppShell>
    </div>
  );
}
