import gsap from "gsap";

import { Breadcrumbs } from "@/components/core/Breadcrumbs";

import { preventNav } from "../../shared/utils";

const TL = { overwrite: "auto" as const, force3D: false };

export function BreadcrumbsMotionCrumbWaveDemo() {
  return (
    <Breadcrumbs
      motion={{
        itemLink: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -2, duration: 0.18 }, 0);
            if (ctx.targets.itemLinkText) {
              tl.to(ctx.targets.itemLinkText, { x: 4, duration: 0.18 }, 0.04);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, duration: 0.16 }, 0);
            if (ctx.targets.itemLinkText) {
              tl.to(ctx.targets.itemLinkText, { x: 0, duration: 0.16 }, 0);
            }
            return tl;
          },
        },
      }}
    >
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Catalog
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Crumb wave</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
