import gsap from "gsap";

import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

import { preventNav } from "../../shared/utils";

const TL = { overwrite: "auto" as const, force3D: false };

export function BreadcrumbsMotionTextTintDemo() {
  return (
    <Breadcrumbs
      collapse={false}
      motion={{
        itemLinkText: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -1, duration: 0.16 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, duration: 0.14 }, 0);
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
            return tl;
          },
        },
        ellipsisLiftWrapper: {
          pressIn: (ctx) =>
            gsap.to(ctx.el, { rotate: 18, scale: 0.9, duration: 0.16, ease: "back.out(1.8)", ...TL }),
          pressOut: (ctx) =>
            gsap.to(ctx.el, { rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut", ...TL }),
        },
      }}
    >
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Library
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Core
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Navigation
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Text tint</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
