import { Button } from "@/components/core/Button";
import { Toast } from "@/components/core/Toast";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ToastMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "hoverIn")}>
          playSlot(root)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Toast
        title="Saved"
        description="Standalone card — slots stay live."
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      />
    </div>
  );
}
