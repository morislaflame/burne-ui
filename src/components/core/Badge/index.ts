import { BadgeRoot } from "./Badge";
import { BadgeAnchor } from "./badgeParts";

export const Badge = Object.assign(BadgeRoot, {
  Anchor: BadgeAnchor,
});

export type {
  BadgeProps,
  BadgeVariant,
  BadgeStatus,
  BadgeSize,
  BadgePlacement,
  BadgeIconPosition,
  BadgeInlineIconPosition,
  BadgeClassNames,
} from "./Badge";
export type { BadgeAnchorProps } from "./badgeTypes";
