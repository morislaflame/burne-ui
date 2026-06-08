import { BadgeAnchor, BadgeRoot } from "./Badge";

export const Badge = Object.assign(BadgeRoot, {
  Anchor: BadgeAnchor,
});

export { BadgeAnchor } from "./Badge";

export type {
  BadgeProps,
  BadgeTone,
  BadgeColor,
  BadgeVariant,
  BadgeSize,
  BadgePlacement,
  BadgeIconPosition,
  BadgeInlineIconPosition,
  BadgeAnchorProps,
} from "./Badge";
