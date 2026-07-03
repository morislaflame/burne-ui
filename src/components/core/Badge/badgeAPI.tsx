import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { Text } from "@/components/core/Text";

import { ensureDecorativeIcon } from "./badgeA11y";
import { BadgeInlineChild } from "./badgeInlineChild";
import { isInlineIconChild, readBadgeInlineIconPosition } from "./badgeInlineIcon";
import {
  badgeIconSlotClass,
  BADGE_TEXT_VARIANT,
} from "./badgeStyles";
import type {
  ResolvedBadgeBody,
  ResolveBadgeBodyProps,
  BadgeSize,
} from "./badgeTypes";

export { isInlineIconChild, readBadgeInlineIconPosition } from "./badgeInlineIcon";

export function hasInlineIconChildren(children: ReactNode): boolean {
  return Children.toArray(children).some(isInlineIconChild);
}

function isBadgeTextContent(node: ReactNode): boolean {
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (isValidElement(node)) return readBadgeInlineIconPosition(node) == null;
  return false;
}

export function hasBadgeTextContent(children: ReactNode): boolean {
  return Children.toArray(children).some(isBadgeTextContent);
}

export function hasMeaningfulContent(node: ReactNode): boolean {
  if (node == null || node === false) return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (Array.isArray(node)) return node.some(hasMeaningfulContent);
  return isValidElement(node);
}

export function renderBadgeInlineChildren(children: ReactNode, size: BadgeSize): ReactNode {
  return Children.map(Children.toArray(children), (child, index) => (
    <Fragment key={index}>
      <BadgeInlineChild node={child} size={size} />
    </Fragment>
  ));
}

export function isBadgeElement(child: ReactElement): boolean {
  return (child.type as { displayName?: string }).displayName === "BadgeRoot";
}

export function resolveBadgeBody({
  size,
  children,
  icon,
  iconOnly,
  iconPosition,
  inlineIconMode,
  meaningChild,
  dot,
}: ResolveBadgeBodyProps): ResolvedBadgeBody {
  if (dot) {
    return {
      layoutKind: "dot",
      bodyContent: null,
      iconOnlyBody: null,
      dataIcon: undefined,
    };
  }

  const resolvedIcon = inlineIconMode ? null : icon;

  const implicitIconOnly = Boolean(resolvedIcon) && !meaningChild;
  const inlineIconOnly =
    inlineIconMode && !meaningChild && Children.toArray(children).length > 0;
  const onlyIconLayout =
    !meaningChild &&
    (implicitIconOnly || Boolean(iconOnly && resolvedIcon) || inlineIconOnly);

  const iconSlot = resolvedIcon ? (
    <span className={badgeIconSlotClass(size)}>
      {isValidElement(resolvedIcon)
        ? ensureDecorativeIcon(resolvedIcon)
        : resolvedIcon}
    </span>
  ) : null;

  const textSlot =
    meaningChild && !inlineIconMode ? (
      <Text as="span" variant={BADGE_TEXT_VARIANT[size]} inheritColor>
        {children}
      </Text>
    ) : null;

  const inlineBody = inlineIconMode ? renderBadgeInlineChildren(children, size) : null;

  const bodyContent = inlineIconMode ? (
    inlineBody
  ) : (
    <>
      {iconPosition === "start" && iconSlot}
      {textSlot}
      {iconPosition === "end" && iconSlot}
    </>
  );

  const iconOnlyBody = inlineIconOnly
    ? inlineBody
    : resolvedIcon
      ? isValidElement(resolvedIcon)
        ? ensureDecorativeIcon(resolvedIcon)
        : resolvedIcon
      : children;

  const showIconWithText = Boolean(!inlineIconMode && iconSlot && textSlot);
  const dataIcon = showIconWithText ? iconPosition : undefined;

  if (onlyIconLayout) {
    return {
      layoutKind: "iconOnly",
      bodyContent,
      iconOnlyBody,
      dataIcon,
    };
  }

  return {
    layoutKind: "text",
    bodyContent,
    iconOnlyBody,
    dataIcon,
  };
}
