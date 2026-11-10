import { Button } from "@/components/core/Button";
import { TimeField } from "@/components/core/TimeField";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TimeFieldMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { exclude: ["prefix"] })}
        >
          Exclude prefix
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <TimeField
        label="Window"
        defaultValue="09:30"
        prefix="@"
        suffix="UTC"
        motionController={controller}
        motion={{
          shell: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          prefix: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          suffix: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
