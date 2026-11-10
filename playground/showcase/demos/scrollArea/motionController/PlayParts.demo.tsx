import { useEffect } from "react";

import { Button } from "@/components/core/Button";
import { ScrollArea } from "@/components/core/ScrollArea";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { ScrollAreaCityList } from "../cities";

export function ScrollAreaMotionPlayPartsDemo() {
  const controller = useMotionControllerHandle();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      controller.playSlot("viewport", "enter");
    });
    return () => cancelAnimationFrame(frame);
  }, [controller]);

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("viewport", "enter")}>
        Play
      </Button>
      <ScrollArea
        aria-label="Cities"
        visibility="always"
        className="h-48 w-64"
        motionController={controller}
        motion={{
          viewport: {
            enter: (ctx) => {
              const tl = ctx.timeline();
              const steps = [ctx.el, ...ctx.getTargets("scrollbar"), ...ctx.getTargets("thumb"), ctx.targets.corner];
              let at = 0;
              for (const el of steps) {
                if (!el) continue;
                tl.fromTo(el, { y: 8 }, { y: 0, duration: 0.28 }, at);
                at += 0.08;
              }
              return tl;
            },
          },
        }}
      >
        <ScrollAreaCityList />
      </ScrollArea>
    </div>
  );
}
