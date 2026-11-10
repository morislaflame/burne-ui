import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "./profile";

export function HoverCardClassNamesDemo() {
  return (
    <HoverCard
      trigger={<HoverCardPersonTrigger />}
      title="Ada Lovelace"
      description="Mathematician"
      classNames={{
        panel: "w-64 border-token-primary",
        arrow: "border-token-primary",
        title: "text-primary",
        description: "text-muted",
        body: "bg-surface",
      }}
    >
      <HoverCardPersonBody />
    </HoverCard>
  );
}
