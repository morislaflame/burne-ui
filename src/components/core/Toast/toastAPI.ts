import { Children, isValidElement, type ReactNode } from "react";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type { ToastStatus } from "./toastTypes";

/** Toast stack peek above the next card — intentional layout constant. */
export const TOAST_STACK_PEEK_PX = 8;
/** Per-depth scale step in the toast stack — intentional layout constant. */
export const TOAST_STACK_SCALE_STEP = 0.04;
export const TOAST_MAX_VISIBLE = 3;
export const TOAST_DEFAULT_TIMEOUT_MS = 4000;
/** Enter slide offset — intentional motion constant (not in `configureMotion`). */
export const TOAST_ENTRY_OFFSET_PX = 24;

export function createToastId(): string {
  return `toast-${Math.random().toString(36).slice(2)}`;
}

function walkToastChildren(
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

export function toastHasTitle(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastTitle");
}

export function toastHasDescription(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastDescription");
}

export function toastHasIndicator(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastIndicator");
}

export function toastHasAction(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastAction");
}

export function toastHasClose(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastClose");
}

export function toastShowsIndicator(
  status: ToastStatus,
  loading: boolean,
  isCompound: boolean,
  compoundHasIndicator: boolean,
): boolean {
  if (isCompound) return compoundHasIndicator;
  if (loading) return true;
  return status !== "default";
}

export function resolveToastGridSlots(
  status: ToastStatus,
  title: ReactNode | undefined,
  description: ReactNode | undefined,
  action: ReactNode | undefined,
  onClose: (() => void) | undefined,
  loading: boolean,
  isCompound: boolean,
  children: ReactNode,
): MessageBannerGridSlots {
  const hasTitle = title != null || toastHasTitle(children);
  const hasDescription = description != null || toastHasDescription(children);

  return {
    hasIndicator: toastShowsIndicator(
      status,
      loading,
      isCompound,
      toastHasIndicator(children),
    ),
    hasTitle,
    hasDescription,
    hasAction: isCompound ? toastHasAction(children) : action != null,
    hasClose: isCompound ? toastHasClose(children) : onClose != null,
  };
}
