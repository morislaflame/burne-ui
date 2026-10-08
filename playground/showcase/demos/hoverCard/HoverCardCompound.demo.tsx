import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";

import { HoverCardPersonBody } from "./profile";

export function HoverCardCompoundDemo() {
  return (
    <HoverCard>
      <HoverCard.Trigger>
        <Button variant="outline">Ada Lovelace</Button>
      </HoverCard.Trigger>
      <HoverCard.Content className="w-64">
        <HoverCard.Arrow />
        <HoverCard.Header>
          <HoverCard.Title>Ada Lovelace</HoverCard.Title>
          <HoverCard.Description>Mathematician</HoverCard.Description>
        </HoverCard.Header>
        <HoverCard.Body>
          <HoverCardPersonBody />
        </HoverCard.Body>
      </HoverCard.Content>
    </HoverCard>
  );
}
