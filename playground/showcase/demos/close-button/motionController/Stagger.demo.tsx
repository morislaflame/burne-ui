import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CloseButtonMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { stagger: 0.08 })}
        >
          Stagger in
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <CloseButton
        aria-label="playAll stagger close"
        motionController={controller}
        motion={{
          root: {
            pressIn: false,
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          icon: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
