import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "../profile";

export function HoverCardMotionNudgeDemo() {
  return (
    <HoverCard
      defaultOpen
      openDelay={0}
      trigger={<HoverCardPersonTrigger />}
      title="Ada Lovelace"
      description="Hover the name."
      classNames={{ content: "w-64" }}
      motion={{
        title: {
          hoverIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.18 }),
          hoverOut: false,
        },
      }}
    >
      <HoverCardPersonBody />
    </HoverCard>
  );
}
