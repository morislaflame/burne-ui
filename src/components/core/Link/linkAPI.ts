import { Children, Fragment, createElement, isValidElement, type ReactNode } from "react";

import type {
  LinkIconPlacement,
  LinkIconProps,
  ResolvedLinkCompoundBody,
  ResolvedLinkIconSlot,
  UseLinkRootStateProps,
} from "./linkTypes";

export const LINK_ICON_DISPLAY_NAME = "Link.Icon";

function elementDisplayName(node: ReactNode): string | undefined {
  if (!isValidElement(node)) return undefined;
  return (node.type as { displayName?: string }).displayName;
}

export function hasLinkCompoundChildren(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    if (elementDisplayName(child) === LINK_ICON_DISPLAY_NAME) return true;
    const nested = (child.props as { children?: ReactNode }).children;
    return nested != null && hasLinkCompoundChildren(nested);
  });
}

function resolveIconSlot(props: LinkIconProps): ResolvedLinkIconSlot {
  const hasCustomIcon = props.children !== undefined && props.children !== null;
  return {
    node: hasCustomIcon ? props.children! : "default",
    muted: !hasCustomIcon,
  };
}

export function resolveLinkCompoundBody(children: ReactNode): ResolvedLinkCompoundBody {
  const textNodes: ReactNode[] = [];
  let startIcon: ResolvedLinkIconSlot | undefined;
  let endIcon: ResolvedLinkIconSlot | undefined;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && elementDisplayName(child) === LINK_ICON_DISPLAY_NAME) {
      const props = child.props as LinkIconProps;
      const slot = resolveIconSlot(props);
      const position = props.position ?? "end";
      if (position === "start") startIcon = slot;
      else endIcon = slot;
      return;
    }
    textNodes.push(child);
  });

  return {
    textChildren:
      textNodes.length === 1 ? textNodes[0]! : createElement(Fragment, null, ...textNodes),
    startIcon,
    endIcon,
  };
}

function resolveIconNode(
  slot: ResolvedLinkIconSlot | undefined,
  fallback: ReactNode | undefined,
  useDefault: boolean,
  defaultMuted: boolean,
): { node: ReactNode | null; muted: boolean } {
  if (slot) {
    return {
      node: slot.node === "default" ? null : slot.node,
      muted: slot.muted,
    };
  }
  if (fallback != null) {
    return { node: fallback, muted: false };
  }
  if (useDefault) {
    return { node: null, muted: defaultMuted };
  }
  return { node: null, muted: false };
}

export function resolveLinkIconPlacement({
  leftIcon,
  rightIcon,
  showDefaultIcon = false,
  defaultIconPosition = "end",
}: Pick<
  UseLinkRootStateProps,
  "leftIcon" | "rightIcon" | "showDefaultIcon" | "defaultIconPosition"
>): LinkIconPlacement {
  const usesDefaultIcon = showDefaultIcon && !leftIcon && !rightIcon;
  const defaultIconAtStart = usesDefaultIcon && defaultIconPosition === "start";
  const defaultIconAtEnd = usesDefaultIcon && defaultIconPosition === "end";

  return {
    usesDefaultIcon,
    defaultIconAtStart,
    defaultIconAtEnd,
  };
}

export function resolveLinkBodyIcons({
  leftIcon,
  rightIcon,
  showDefaultIcon,
  defaultIconPosition,
  children,
}: UseLinkRootStateProps): {
  textChildren: ReactNode;
  startIcon: ReactNode | null;
  endIcon: ReactNode | null;
  startIconMuted: boolean;
  endIconMuted: boolean;
  usesDefaultAtStart: boolean;
  usesDefaultAtEnd: boolean;
} {
  const isCompound = children != null && hasLinkCompoundChildren(children);

  if (isCompound) {
    const body = resolveLinkCompoundBody(children);
    const start = resolveIconNode(body.startIcon, undefined, false, true);
    const end = resolveIconNode(body.endIcon, undefined, false, true);

    return {
      textChildren: body.textChildren,
      startIcon: start.node,
      endIcon: end.node,
      startIconMuted: start.muted,
      endIconMuted: end.muted,
      usesDefaultAtStart: body.startIcon?.node === "default",
      usesDefaultAtEnd: body.endIcon?.node === "default",
    };
  }

  const placement = resolveLinkIconPlacement({
    leftIcon,
    rightIcon,
    showDefaultIcon,
    defaultIconPosition,
  });

  return {
    textChildren: children ?? null,
    startIcon: leftIcon ?? null,
    endIcon: rightIcon ?? null,
    startIconMuted: placement.defaultIconAtStart,
    endIconMuted: placement.defaultIconAtEnd,
    usesDefaultAtStart: placement.defaultIconAtStart,
    usesDefaultAtEnd: placement.defaultIconAtEnd,
  };
}
