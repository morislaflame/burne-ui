import gsap from "gsap";

import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

const TL = { overwrite: "auto" as const, force3D: false };

export function TabsMotionPanelWaveDemo() {
  return (
    <Tabs
      defaultValue="one"
      motion={{
        panel: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28, ...TL }),
        },
        tab: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -1, duration: 0.16 }, 0);
            if (ctx.targets.tabText) tl.to(ctx.targets.tabText, { x: 2, duration: 0.16 }, 0);
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, duration: 0.14 }, 0);
            if (ctx.targets.tabText) tl.to(ctx.targets.tabText, { x: 0, duration: 0.14 }, 0);
            return tl;
          },
        },
      }}
    >
      <Tabs.List aria-label="Wave">
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">
        <Text variant="base">Panel wave</Text>
      </Tabs.Panel>
      <Tabs.Panel value="two">
        <Text variant="base">Second panel</Text>
      </Tabs.Panel>
    </Tabs>
  );
}
