import gsap from "gsap";
import { IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

const TL = { overwrite: "auto" as const, force3D: false };

export function ListBoxMotionItemWaveDemo() {
  return (
    <Surface variant="default" padding="mid" className="max-w-sm">
      <ListBox defaultValue="en" aria-label="Item wave">
        <ListBox.Item
          value="en"
          label="English"
          icon={<IoGlobeOutline aria-hidden />}
          motion={{
            hoverIn: (ctx) => {
              const tl = gsap.timeline({ ...TL });
              tl.to(ctx.el, { x: 4, duration: 0.18 }, 0);
              if (ctx.targets.label) {
                tl.to(ctx.targets.label, { x: 6, duration: 0.18 }, 0.04);
              }
              if (ctx.targets.icon) {
                tl.to(ctx.targets.icon, { rotate: 16, duration: 0.2 }, 0);
              }
              return tl;
            },
            hoverOut: (ctx) => {
              const tl = gsap.timeline({ ...TL });
              tl.to(ctx.el, { x: 0, duration: 0.16 }, 0);
              if (ctx.targets.label) {
                tl.to(ctx.targets.label, { x: 0, duration: 0.16 }, 0);
              }
              if (ctx.targets.icon) {
                tl.to(ctx.targets.icon, { rotate: 0, duration: 0.16 }, 0);
              }
              return tl;
            },
          }}
        />
        <ListBox.Item value="de" label="Deutsch" icon={<IoGlobeOutline aria-hidden />} />
      </ListBox>
    </Surface>
  );
}
