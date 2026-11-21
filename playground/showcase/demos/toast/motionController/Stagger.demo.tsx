import { Button } from "@/components/core/Button";
import { Toast } from "@/components/core/Toast";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ToastMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { stagger: 0.1 })}
        >
          Stagger in
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Toast
        title="Saved"
        description="Standalone card — slots stay live."
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          title: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          description: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
