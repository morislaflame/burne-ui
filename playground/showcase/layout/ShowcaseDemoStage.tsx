import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

export type ShowcaseDemoAlign = "start" | "center" | "stretch";

/**
 * Shared stage for every showcase demo (gallery slides and from-file).
 * Sizes the card, never the component: do not set `w-fit` on children —
 * that overrides `w-8` / `w-64` and collapses empty controls (ColorSwatch,
 * ColorPicker.Trigger via asChild).
 */
export function showcaseDemoStageClass(align: ShowcaseDemoAlign = "start") {
  return cn(
    "flex w-full min-w-0 max-w-full",
    align === "stretch"
      ? "flex-col"
      : align === "center"
        ? "flex-col items-center justify-center"
        : "items-center justify-center",
  );
}

export function ShowcaseDemoStage({
  align = "start",
  children,
  className,
}: {
  align?: ShowcaseDemoAlign;
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(showcaseDemoStageClass(align), className)}>{children}</div>;
}
