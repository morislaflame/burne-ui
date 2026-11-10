import { Button } from "@/components/core/Button";
import { Sidebar } from "@/components/core/Sidebar";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SidebarMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>play()</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>Snap</Button>
      </div>
      <Sidebar aria-label="Sections" motionController={controller} motion={{ root: { hoverIn: { y: -6, duration: 0.25, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } } }}>Nav</Sidebar>
    </div>
  );
}
