import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoHeartOutline } from "react-icons/io5";

export function ToggleButtonMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("check", { exclude: ["fill"] })}
        >
          Check skip fill
        </Button>
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("uncheck", { exclude: ["fill"] })}
        >
          Uncheck skip fill
        </Button>
      </div>
      <ToggleButton
        variant="outline"
        icon={<IoHeartOutline aria-hidden />}
        motionController={controller}
        motion={{
          root: { pressIn: false },
          iconStart: {
            check: (ctx) => ctx.fromRest({ rotation: 20, duration: 0.24, ease: "back.out(1.8)" }),
            uncheck: (ctx) => ctx.to({ rotation: 0, duration: 0.16 }),
          },
          text: {
            check: { y: -4, duration: 0.2, replay: "rest" },
            uncheck: { y: 0, duration: 0.16 },
          },
        }}
      >
        Like
      </ToggleButton>
    </div>
  );
}
