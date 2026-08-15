import gsap from "gsap";

import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function TabsMotionSelectionTintDemo() {
  return (
    <Tabs
      defaultValue="one"
      motion={{
        tab: {
          check: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 1.04, duration: 0.16 }, 0);
            tl.to(ctx.el, { scale: 1, duration: 0.18 }, 0.16);
            if (ctx.targets.tabText) tweenCssColor(ctx.targets.tabText, "var(--color-primary)");
            return tl;
          },
          uncheck: (ctx) => {
            if (ctx.targets.tabText) {
              tweenCssColor(ctx.targets.tabText, "var(--color-foreground)", { clearOnComplete: true });
            }
          },
        },
      }}
    >
      <Tabs.List aria-label="Selection">
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">
        <Text variant="base">check / uncheck on tab</Text>
      </Tabs.Panel>
      <Tabs.Panel value="two">
        <Text variant="base">Indicator FLIP stays kit-internal</Text>
      </Tabs.Panel>
    </Tabs>
  );
}
