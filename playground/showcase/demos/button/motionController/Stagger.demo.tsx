import { IoRocketOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const STAGGER_EXCLUDE = ["loader", "success", "error", "label"] as const;

export function ButtonMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { stagger: 0.07, exclude: [...STAGGER_EXCLUDE] })}
        >
          Stagger in
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut", { exclude: [...STAGGER_EXCLUDE] })}>
          Reset
        </Button>
      </div>
      <Button
        variant="secondary"
        icon={<IoRocketOutline aria-hidden />}
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
          text: {
            hoverIn: { y: -5, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        playAll stagger
      </Button>
    </div>
  );
}
