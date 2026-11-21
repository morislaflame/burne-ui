import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "./profile";

export function HoverCardInstantDemo() {
  return (
    <HoverCard
      openDelay={0}
      trigger={<HoverCardPersonTrigger />}
      title="Ada Lovelace"
      description="Opens as soon as the pointer arrives."
      classNames={{ content: "w-64" }}
    >
      <HoverCardPersonBody />
    </HoverCard>
  );
}
