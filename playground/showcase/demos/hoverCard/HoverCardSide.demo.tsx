import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "./profile";

export function HoverCardSideDemo() {
  return (
    <HoverCard
      side="top"
      trigger={<HoverCardPersonTrigger />}
      title="Ada Lovelace"
      description="The card opens above the name."
      classNames={{ content: "w-64" }}
    >
      <HoverCardPersonBody />
    </HoverCard>
  );
}
