import { Button } from "@/components/core/Button";
import { ProgressBar } from "@/components/core/ProgressBar";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ProgressBarMotionControllerPlayValueDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("value", "hoverIn")}>
          playSlot(value)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "hoverIn")}>
          playSlot(label)
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <ProgressBar
        value={62}
        showValue
        motionController={controller}
        motion={{
          label: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          value: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <ProgressBar.Header>
          <ProgressBar.Label>Upload</ProgressBar.Label>
          <ProgressBar.Value />
        </ProgressBar.Header>
        <ProgressBar.Track value={62} />
      </ProgressBar>
    </div>
  );
}
