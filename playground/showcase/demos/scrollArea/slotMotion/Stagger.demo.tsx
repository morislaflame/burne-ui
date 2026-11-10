import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "../cities";

export function ScrollAreaMotionStaggerDemo() {
  return (
    <ScrollArea
      aria-label="Cities"
      visibility="always"
      className="h-48 w-64"
      motion={{
        viewport: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            let at = 0;
            const steps = [ctx.el, ...ctx.getTargets("scrollbar"), ...ctx.getTargets("thumb")];
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
  );
}
