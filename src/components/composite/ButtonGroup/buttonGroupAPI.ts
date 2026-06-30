import type { ClassValue } from "clsx";
import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { Dropdown } from "@/components/core/Dropdown";
import { InputControl } from "@/components/core/Input";
import { SearchInput } from "@/components/core/SearchInput";
import { cn } from "@/utils/cn";

import type {
  ButtonGroupOrientation,
  ButtonGroupSegment,
  ButtonGroupSegmentPosition,
} from "./buttonGroupTypes";

export function mergeButtonGroupSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function flattenFragmentChildren(children: ReactNode): ReactElement[] {
  const out: ReactElement[] = [];
  Children.forEach(children, (node) => {
    if (!isValidElement(node)) return;
    if (node.type === Fragment) {
      const { children: fragKids } = node.props as { children?: ReactNode };
      out.push(...flattenFragmentChildren(fragKids));
      return;
    }
    out.push(node);
  });
  return out;
}

export function isGroupSegmentSlot(child: ReactElement): boolean {
  return (
    child.type === Button ||
    child.type === InputControl ||
    child.type === ComboBox ||
    child.type === SearchInput ||
    child.type === Dropdown ||
    (child.type as { displayName?: string }).displayName === "ButtonGroupText"
  );
}

export function resolveButtonGroupSegmentPosition(
  segmentIndex: number,
  segmentCount: number,
): ButtonGroupSegmentPosition {
  if (segmentCount <= 1) return "only";
  if (segmentIndex === 0) return "first";
  if (segmentIndex === segmentCount - 1) return "last";
  return "middle";
}

export function buildButtonGroupSegment(
  orientation: ButtonGroupOrientation,
  position: ButtonGroupSegmentPosition,
): ButtonGroupSegment {
  return { orientation, position };
}

export function countGroupSegmentSlots(children: ReactElement[]): number {
  return children.reduce((n, el) => n + (isGroupSegmentSlot(el) ? 1 : 0), 0);
}
