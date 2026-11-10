import { useMemo } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import { BADGE_ANCHOR_PLACEMENT } from "./badgeStyles";
import type { BadgePlacement, UseBadgeRootStateProps } from "./badgeTypes";
import { hasBadgeTextContent, hasInlineIconChildren, hasMeaningfulContent, resolveBadgeBody } from "./badgeAPI";
import { useBadgeDirectAnchorChild } from "./badgeContext";
import { badgeSurfaceClass } from "./badgeStyles";
 
export function useBadgeRootState({
  variant: variantProp,
  status,
  size,
  children,
  icon,
  iconOnly,
  iconPosition,
  dot,
  placement,
  iconSlotClass,
}: UseBadgeRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const isDirectAnchorChild = useBadgeDirectAnchorChild();
  const surfaceClass = badgeSurfaceClass(variant, status);
 
  const inlineIconMode = hasInlineIconChildren(children);
  const meaningChild = useMemo(
    () =>
      inlineIconMode
        ? hasBadgeTextContent(children)
        : hasMeaningfulContent(children),
    [children, inlineIconMode],
  );
 
  const placementResolved: BadgePlacement | undefined = isDirectAnchorChild
    ? placement ?? "top-right"
    : undefined;
 
  const placementClass = placementResolved
    ? BADGE_ANCHOR_PLACEMENT[placementResolved]
    : "";
 
  const body = useMemo(
    () =>
      resolveBadgeBody({
        size,
        children,
        icon,
        iconOnly,
        iconPosition,
        inlineIconMode,
        meaningChild,
        dot,
        iconSlotClass,
      }),
    [children, dot, icon, iconOnly, iconPosition, iconSlotClass, inlineIconMode, meaningChild, size],
  );
 
  return {
    size,
    surfaceClass,
    inlineIconMode,
    meaningChild,
    placementClass,
    isDirectAnchorChild,
    layoutKind: body.layoutKind,
    bodyContent: body.bodyContent,
    iconOnlyBody: body.iconOnlyBody,
    dataIcon: body.dataIcon,
  };
}
 