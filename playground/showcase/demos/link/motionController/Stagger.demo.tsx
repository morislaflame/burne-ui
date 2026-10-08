import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

export function LinkMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
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
      <Link
        href="#"
        onClick={preventNav}
        underline
        showDefaultIcon
        motionController={controller}
        motion={{
          root: {
            pressIn: false,
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
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
        playAll stagger
      </Link>
    </div>
  );
}
