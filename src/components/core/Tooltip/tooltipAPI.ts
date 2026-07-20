import { Children, isValidElement, type ReactElement, type ReactNode, type Ref } from "react";

import type { TooltipVariant } from "./tooltipTypes";

export const TOOLTIP_COMPOUND_SLOT_NAMES = new Set([
  "TooltipIndicator",
  "TooltipIcon",
  "TooltipTitle",
  "TooltipDescription",
  "TooltipMessage",
]);

export function walkTooltipChildren(
  node: ReactNode,
  match: (displayName: string | undefined) => boolean,
): boolean {
  let found = false;

  const walk = (current: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(current)) {
      if (!isValidElement(child)) continue;
      const displayName = (child.type as { displayName?: string }).displayName;
      if (match(displayName)) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(node);
  return found;
}

export function hasTooltipCompoundChildren(children: ReactNode): boolean {
  return walkTooltipChildren(
    children,
    (name) => name != null && TOOLTIP_COMPOUND_SLOT_NAMES.has(name),
  );
}

export function tooltipHasTitle(children: ReactNode): boolean {
  return walkTooltipChildren(children, (name) => name === "TooltipTitle");
}

export function tooltipHasDescription(children: ReactNode): boolean {
  return walkTooltipChildren(children, (name) => name === "TooltipDescription");
}

export function tooltipHasIndicator(children: ReactNode): boolean {
  return walkTooltipChildren(
    children,
    (name) => name === "TooltipIndicator" || name === "TooltipIcon",
  );
}

function walkTooltipIndicatorProps(
  node: ReactNode,
  visit: (props: { children?: ReactNode; showIcon?: boolean }) => void,
): void {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue;
    const displayName = (child.type as { displayName?: string }).displayName;
    if (displayName === "TooltipIndicator" || displayName === "TooltipIcon") {
      visit(child.props as { children?: ReactNode; showIcon?: boolean });
    }
    walkTooltipIndicatorProps((child.props as { children?: ReactNode }).children, visit);
  }
}

export function tooltipIndicatorWouldRender(
  variant: TooltipVariant,
  icon: ReactNode | undefined,
  showIcon: boolean | undefined,
  indicatorChildren: ReactNode | undefined,
): boolean {
  if (showIcon === false) return false;
  if (indicatorChildren === null) return false;
  if (indicatorChildren !== undefined) return true;
  if (icon != null) return true;
  return isSemanticTooltipVariant(variant);
}

export function tooltipCompoundShowsIndicator(
  children: ReactNode,
  variant: TooltipVariant,
  icon: ReactNode | undefined,
  showIcon: boolean | undefined,
): boolean {
  if (!tooltipHasIndicator(children)) return false;
  let visible = false;
  walkTooltipIndicatorProps(children, (props) => {
    if (
      tooltipIndicatorWouldRender(
        variant,
        icon,
        props.showIcon ?? showIcon,
        props.children,
      )
    ) {
      visible = true;
    }
  });
  return visible;
}

export function isSemanticTooltipVariant(v: TooltipVariant): v is "danger" | "success" | "info" | "warning" {
  return v === "danger" || v === "success" || v === "info" || v === "warning";
}

export function tooltipShowsIndicator(
  variant: TooltipVariant,
  icon: ReactNode | undefined,
  showIcon: boolean | undefined,
  isCompound: boolean,
  children: ReactNode,
): boolean {
  if (showIcon === false) return false;
  if (isCompound) return tooltipCompoundShowsIndicator(children, variant, icon, showIcon);
  if (icon != null) return true;
  return isSemanticTooltipVariant(variant);
}

export function resolveTooltipGridSlots({
  variant,
  icon,
  showIcon,
  title,
  description,
  isCompound,
  children,
}: {
  variant: TooltipVariant;
  icon?: ReactNode;
  showIcon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  isCompound: boolean;
  children?: ReactNode;
}) {
  const hasTitle =
    title != null ||
    (isCompound
      ? tooltipHasTitle(children)
      : children != null && description == null);
  const hasDescription =
    description != null || (isCompound && tooltipHasDescription(children));

  return {
    hasIndicator: tooltipShowsIndicator(variant, icon, showIcon, isCompound, children),
    hasTitle,
    hasDescription,
    hasAction: false,
    hasClose: false,
  };
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}

export function isTooltipArrowElement(el: ReactElement): boolean {
  return (el.type as { displayName?: string }).displayName === "TooltipArrow";
}
