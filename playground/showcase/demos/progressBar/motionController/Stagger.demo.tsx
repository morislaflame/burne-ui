import { Button } from "@/components/core/Button";
import { ProgressBar } from "@/components/core/ProgressBar";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ProgressBarMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
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
      <ProgressBar
        label="Upload"
        showValue
        value={62}
        motionController={controller}
        motion={{
          track: {
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          fill: {
            hoverIn: (ctx) => ctx.fromRest({ opacity: 0.4, duration: 0.22 }),
            hoverOut: (ctx) => ctx.to({ opacity: 1, duration: 0.16 }),
          },
        }}
      />
    </div>
  );
}
