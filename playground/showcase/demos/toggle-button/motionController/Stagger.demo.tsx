import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoBookmarkOutline, IoHeartOutline } from "react-icons/io5";

export function ToggleButtonMotionControllerStaggerDemo() {
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
      <ToggleButton
        variant="outline"
        motionController={controller}
        motion={{
          root: {
            pressIn: false,
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          iconStart: {
            hoverIn: { y: -8, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          text: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          iconEnd: {
            hoverIn: { y: -10, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
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
