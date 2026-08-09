import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { ensureDecorativeIcon } from "./badgeA11y";
import { BadgeInlineChild } from "./badgeInlineChild";
import { isInlineIconChild, readBadgeInlineIconPosition } from "./badgeInlineIcon";
import { badgeIconSlotClass, BADGE_TEXT_CLASS, BADGE_TEXT_VARIANT } from "./badgeStyles";
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

/** Single digit `0`–`9` → circular badge (same layout as icon-only). */
export function isBadgeSingleDigitContent(children: ReactNode): boolean {
  const parts = Children.toArray(children).filter(
    (node) => !(typeof node === "string" && node.trim() === ""),
  );
  if (parts.length !== 1) return false;
  const only = parts[0];
  if (typeof only === "number") {
    return Number.isInteger(only) && only >= 0 && only <= 9;
  }
  if (typeof only === "string") {
    return /^\d$/.test(only.trim());
  }
  return false;
}

function badgeSingleDigitLabel(children: ReactNode): string | number {
  const parts = Children.toArray(children).filter(
    (node) => !(typeof node === "string" && node.trim() === ""),
  );
  const only = parts[0];
  if (typeof only === "number") return only;
  if (typeof only === "string") return only.trim();
  return "";
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

  const singleDigit =
    !inlineIconMode &&
    !resolvedIcon &&
    !iconOnly &&
    meaningChild &&
    isBadgeSingleDigitContent(children);

  const iconSlot = resolvedIcon ? (
    <span className={badgeIconSlotClass(size)}>
      {isValidElement(resolvedIcon)
        ? ensureDecorativeIcon(resolvedIcon)
        : resolvedIcon}
    </span>
  ) : null;

  const textSlot =
    meaningChild && !inlineIconMode ? (
      <Text as="span" variant={BADGE_TEXT_VARIANT[size]} inheritColor className={BADGE_TEXT_CLASS}>
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

  if (onlyIconLayout || singleDigit) {
    const iconOnlyBody = singleDigit ? (
      <Text
        as="span"
        variant={BADGE_TEXT_VARIANT[size]}
        inheritColor
        className={cn(BADGE_TEXT_CLASS, "tabular-nums")}
      >
        {badgeSingleDigitLabel(children)}
      </Text>
    ) : inlineIconOnly ? (
      inlineBody
    ) : resolvedIcon ? (
      isValidElement(resolvedIcon) ? (
        ensureDecorativeIcon(resolvedIcon)
      ) : (
        resolvedIcon
      )
    ) : (
      children
    );

    return {
      layoutKind: "iconOnly",
      bodyContent,
      iconOnlyBody,
      dataIcon: undefined,
    };
  }

  const showIconWithText = Boolean(!inlineIconMode && iconSlot && textSlot);
  const dataIcon = showIconWithText ? iconPosition : undefined;

  return {
    layoutKind: "text",
    bodyContent,
    iconOnlyBody: null,
    dataIcon,
  };
}
