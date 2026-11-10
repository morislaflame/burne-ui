import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "./profile";

export function HoverCardDefaultDemo() {
  return (
    <HoverCard
      trigger={<HoverCardPersonTrigger />}
      title="Ada Lovelace"
      description="Mathematician"
      classNames={{ content: "w-64" }}
    >
      <HoverCardPersonBody />
    </HoverCard>
  );
}
