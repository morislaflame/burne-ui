import gsap from "gsap";

import { Avatar } from "@/components/core/Avatar";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/stories-utils/mockImages";

const TL = { overwrite: "auto" as const, force3D: false };

export function AvatarMotionGroupRotateDemo() {
  return (
    <Avatar.Group
      motion={{
        groupItem: {
          hoverIn: (ctx) =>
            gsap.to(ctx.el, {
              y: -14,
              rotation: -8,
              scale: 1.12,
              duration: 0.28,
              ease: "back.out(1.6)",
              ...TL,
            }),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, {
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
              ...TL,
            }),
        },
      }}
    >
      <Avatar size="base" label="One" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar size="base" label="Two" src={PIN_IMAGE2} alt="" loading="lazy" />
      <Avatar size="base" label="Three" src={PIN_IMAGE3} alt="" loading="lazy" />
    </Avatar.Group>
  );
}
