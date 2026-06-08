import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

import { SliderFill } from "./sliderFill";
import { useSliderTrackContext } from "./sliderTrackContext";

export type SliderRailProps = HTMLAttributes<HTMLDivElement>;

export function SliderRail({ className, children, ...rest }: SliderRailProps) {
  const ctx = useSliderTrackContext();

  return (
    <div className={cn(ctx.railClass, className)} aria-hidden {...rest}>
      {children ?? (
        <>
          <SliderFill />
          {ctx.markNodes}
        </>
      )}
    </div>
  );
}

SliderRail.displayName = "SliderRail";
