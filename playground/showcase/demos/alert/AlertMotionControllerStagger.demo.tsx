import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function AlertMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { stagger: 0.07 })}
        >
          Stagger in
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Alert
        status="success"
        title="playAll"
        description="Each live slot starts 70ms after the previous."
        hoverLift={false}
        motionController={controller}
        motion={{
          root: { hoverIn: { y: -2, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          indicator: { hoverIn: { y: -6, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          title: { hoverIn: { y: -5, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          description: { hoverIn: { y: -3, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
        }}
      />
    </div>
  );
}
