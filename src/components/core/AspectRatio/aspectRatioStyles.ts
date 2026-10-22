import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

export const ASPECT_RATIO_ROOT_CLASS = "relative w-full min-w-0";

export const ASPECT_RATIO_CONTENT_CLASS = "absolute inset-0 size-full min-h-0 min-w-0 overflow-hidden";

export function aspectRatioRootClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(ASPECT_RATIO_ROOT_CLASS, layoutTargetClass("aspectRatio.root"), slotClass, className);
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
