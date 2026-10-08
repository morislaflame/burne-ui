import gsap from "gsap";

import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "../cities";

export function ScrollAreaMotionOriginDemo() {
  return (
    <ScrollArea
      aria-label="Cities"
      visibility="always"
      className="h-48 w-64"
      motion={{
        thumb: {
          hoverIn: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { scale: 0.86, transformOrigin: "50% 50%" },
              { scale: 1, duration: 0.22, overwrite: "auto", force3D: false },
            ),
          hoverOut: (ctx) => gsap.to(ctx.el, { scale: 1, duration: 0.16, overwrite: "auto", force3D: false }),
        },
      }}
    >
      <ScrollAreaCityList />
    </ScrollArea>
  );
}
