import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function AlertMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { exclude: ["description"] })}
        >
          Skip description
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Alert
        status="success"
        title="playAll exclude"
        description="This line stays put — exclude: ['description']."
        hoverLift={false}
        motionController={controller}
        motion={{
          root: { hoverIn: { y: -2, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          indicator: { hoverIn: { y: -8, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          title: { hoverIn: { y: -6, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
          description: { hoverIn: { y: -6, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } },
        }}
      />
    </div>
  );
}
