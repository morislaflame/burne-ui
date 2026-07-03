import { isValidElement } from "react";

import { Text } from "@/components/core/Text";

import { ensureDecorativeIcon } from "./badgeA11y";
import { readBadgeInlineIconPosition } from "./badgeInlineIcon";
import { badgeIconSlotClass, BADGE_TEXT_VARIANT } from "./badgeStyles";
import type { BadgeInlineChildProps } from "./badgeTypes";

export function BadgeInlineChild({ node, size }: BadgeInlineChildProps) {
  if (node == null || node === false) return null;

  if (typeof node === "string") {
    const trimmed = node.trim();
    if (!trimmed) return null;
    return (
      <Text as="span" variant={BADGE_TEXT_VARIANT[size]} inheritColor>
        {node}
      </Text>
    );
  }

  if (typeof node === "number") {
    return (
      <Text as="span" variant={BADGE_TEXT_VARIANT[size]} inheritColor>
        {node}
      </Text>
    );
  }

  if (isValidElement(node)) {
    if (readBadgeInlineIconPosition(node)) {
      return (
        <span className={badgeIconSlotClass(size)}>
          {ensureDecorativeIcon(node)}
        </span>
      );
    }
    return node;
  }

  return null;
}
