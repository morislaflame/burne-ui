import { HoverCardRoot } from "./HoverCard";
import {
  HoverCardArrow,
  HoverCardBody,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "./hoverCardParts";

export const HoverCard = Object.assign(HoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
  Header: HoverCardHeader,
  Title: HoverCardTitle,
  Description: HoverCardDescription,
  Body: HoverCardBody,
  Arrow: HoverCardArrow,
});

export type {
  HoverCardClassNames,
  HoverCardContentProps,
  HoverCardMotion,
  HoverCardPartMotion,
  HoverCardProps,
  HoverCardSide,
  HoverCardSize,
  HoverCardTriggerProps,
  HoverCardVariant,
} from "./hoverCardTypes";

export { HOVER_CARD_CLOSE_DELAY, HOVER_CARD_OPEN_DELAY } from "./hoverCardTypes";
