import { cn } from "@/utils/cn";

export function scaleFieldRootClassName(
  orientation: "horizontal" | "vertical",
  className?: string,
) {
  return cn(
    orientation === "horizontal" ? "w-full" : "w-auto items-center",
    className,
  );
}
