import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { AspectRatioValue } from "./aspectRatioTypes";

export const ASPECT_RATIO_ROOT_CLASS = "relative w-full min-w-0 shrink-0";

export const ASPECT_RATIO_CONTENT_CLASS = "absolute inset-0 size-full min-h-0 min-w-0 overflow-hidden";

export function resolveSafeAspectRatio(ratio: AspectRatioValue | undefined): AspectRatioValue {
  if (typeof ratio === "number") {
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  }
  if (typeof ratio === "string") {
    const parts = ratio.split("/");
    if (parts.length === 2) {
      const w = Number(parts[0]);
      const h = Number(parts[1]);
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
        return ratio;
      }
    }
    return 1;
  }
  return 1;
}

export function aspectRatioRootClass({
  skinVariant,
  slotClass,
  className,
}: {
  skinVariant?: string;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    ASPECT_RATIO_ROOT_CLASS,
    layoutTargetClass("aspectRatio.root", skinVariant),
    slotClass,
    className,
  );
}

export function aspectRatioContentClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(ASPECT_RATIO_CONTENT_CLASS, slotClass, className);
}
