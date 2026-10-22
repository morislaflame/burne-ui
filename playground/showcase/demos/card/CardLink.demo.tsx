import { Card } from "@/components/core/Card";

export function CardLinkDemo() {
  return (
    <Card asChild className="max-w-sm">
      <a href="#inbox" onClick={(event) => event.preventDefault()}>
        <Card.Title>Inbox</Card.Title>
        <Card.Description>The whole card is a link. In Next.js pass `next/link` the same way.</Card.Description>
      </a>
    </Card>
  );
}
