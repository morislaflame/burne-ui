import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "../profile";

export function HoverCardMotionAppearDemo() {
  return (
    <HoverCard
      defaultOpen
      trigger={<HoverCardPersonTrigger />}
      title="Ada Lovelace"
      description="Mathematician"
      classNames={{ content: "w-64" }}
      motion={{
        content: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            const steps = [ctx.el, ctx.targets.title, ctx.targets.description, ctx.targets.body];
            let at = 0;
            for (const el of steps) {
              if (!el) continue;
              tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28 }, at);
              at += 0.08;
            }
            return tl;
          },
        },
      }}
    >
      <HoverCardPersonBody />
    </HoverCard>
  );
}
