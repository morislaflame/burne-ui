/**
 * Slot motion for Breadcrumbs — look here first.
 *
 * DOM slots: `list` (`<ol>`), `separator` (kit chevron + `Breadcrumbs.Separator`,
 * root/list scope, repeated), `itemLink` (interactive `<a>` / `<button>`),
 * `itemLinkText`, `ellipsisLiftWrapper`
 *
 * Each interactive crumb / ellipsis nests a unique scope (not shared-scope repeated).
 * `list` / `separator` register on the root scope. `Breadcrumbs.Item` is data-only.
 * Defaults: `pressSqueeze` on `itemLink` / `ellipsisLiftWrapper` (`pressOut: false`).
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useOptionalBreadcrumbsMotionScope } from "./breadcrumbsContext";
import type { BreadcrumbsMotion, BreadcrumbsPartMotion } from "./breadcrumbsTypes";

export function resolveBreadcrumbsItemMotionDefaults(): BreadcrumbsMotion {
  return {
    itemLink: {
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}

export function resolveBreadcrumbsEllipsisMotionDefaults(): BreadcrumbsMotion {
  return {
    ellipsisLiftWrapper: {
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}

export function useBreadcrumbsSlotMotion<T extends HTMLElement>(
  slot: "list" | "separator",
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: BreadcrumbsPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  } = {},
) {
  const scope = useOptionalBreadcrumbsMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
