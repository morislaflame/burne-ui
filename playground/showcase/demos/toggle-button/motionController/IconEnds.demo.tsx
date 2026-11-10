import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoBookmarkOutline, IoHeartOutline } from "react-icons/io5";

export function ToggleButtonMotionControllerIconEndsDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("iconStart", "hoverIn")}>
          iconStart
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("iconEnd", "hoverIn")}>
          iconEnd
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <ToggleButton
        variant="outline"
        motionController={controller}
        motion={{
          root: { pressIn: false },
          iconStart: {
            hoverIn: (ctx) => ctx.fromRest({ rotation: -22, duration: 0.24, ease: "back.out(1.8)" }),
            hoverOut: (ctx) => ctx.to({ rotation: 0, duration: 0.18 }),
          },
          iconEnd: {
            hoverIn: (ctx) => ctx.fromRest({ y: -8, duration: 0.22, ease: "power2.out" }),
            hoverOut: (ctx) => ctx.to({ y: 0, duration: 0.16 }),
          },
        }}
      >
        <ToggleButton.IconStart>
          <IoHeartOutline aria-hidden />
        </ToggleButton.IconStart>
        <ToggleButton.Text>Save</ToggleButton.Text>
        <ToggleButton.IconEnd>
          <IoBookmarkOutline aria-hidden />
        </ToggleButton.IconEnd>
      </ToggleButton>
    </div>
  );
}
