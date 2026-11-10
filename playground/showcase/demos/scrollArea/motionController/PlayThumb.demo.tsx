import { Button } from "@/components/core/Button";
import { ScrollArea } from "@/components/core/ScrollArea";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { ScrollAreaCityList } from "../cities";

export function ScrollAreaMotionPlayThumbDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("thumb", "hoverIn")}>
          Lift
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("thumb", "hoverOut")}>
          Rest
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("thumb", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ScrollArea
        aria-label="Cities"
        visibility="always"
        className="h-48 w-64"
        motionController={controller}
        motion={{
          thumb: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <ScrollAreaCityList />
      </ScrollArea>
    </div>
  );
}
