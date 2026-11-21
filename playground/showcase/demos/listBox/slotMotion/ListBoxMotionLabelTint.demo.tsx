import { IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function ListBoxMotionLabelTintDemo() {
  return (
    <Surface variant="default" padding="mid" className="max-w-sm">
      <ListBox defaultValue="ru" aria-label="Label tint">
        <ListBox.Item value="ru">
          <ListBox.Label
            motion={{
              hoverIn: (ctx) => {
                const tl = ctx.timeline();
                tl.to(ctx.el, { y: -1, duration: 0.16 }, 0);
                tweenCssColor(ctx.el, "var(--color-primary)");
                return tl;
              },
              hoverOut: (ctx) => {
                const tl = ctx.timeline();
                tl.to(ctx.el, { y: 0, duration: 0.14 }, 0);
                tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
                return tl;
              },
            }}
          >
            Russian
          </ListBox.Label>
          <ListBox.Icon
            motion={{
              pressIn: (ctx) =>
                ctx.to({ rotate: 90, scale: 0.88, duration: 0.16, ease: "back.out(1.8)" }),
              pressOut: (ctx) =>
                ctx.to({ rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut" }),
            }}
          >
            <IoGlobeOutline aria-hidden />
          </ListBox.Icon>
        </ListBox.Item>
        <ListBox.Item value="en" label="English" icon={<IoGlobeOutline aria-hidden />} />
      </ListBox>
    </Surface>
  );
}
