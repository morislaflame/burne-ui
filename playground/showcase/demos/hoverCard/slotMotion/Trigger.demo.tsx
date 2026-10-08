import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonTrigger } from "../profile";

export function HoverCardMotionTriggerDemo() {
  return (
    <HoverCard
      openDelay={0}
      trigger={
        <HoverCardPersonTrigger
          motion={{
            root: { hoverIn: false, hoverOut: false },
          }}
        />
      }
      title="Ada Lovelace"
      description="The name nudges, then the card opens."
      classNames={{ content: "w-64" }}
      motion={{
        trigger: {
          hoverIn: (ctx) => ctx.fromRest({ y: -6, yoyo: true, repeat: 1, duration: 0.22 }),
          hoverOut: false,
        },
      }}
    />
  );
}
