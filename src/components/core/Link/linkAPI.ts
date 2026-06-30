import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

import type { LinkIconPlacement, UseLinkRootStateProps } from "./linkTypes";

export function mergeLinkSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
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
