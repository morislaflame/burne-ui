import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function KbdMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { exclude: ["text"] })}
        >
          Exclude text
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Kbd
        hoverLift={false}
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          text: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        ⌘
      </Kbd>
    </div>
  );
}
