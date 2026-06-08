import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

import { useSliderTrackContext } from "./sliderTrackContext";

export type SliderFillProps = HTMLAttributes<HTMLSpanElement>;

export function SliderFill({ className, ...rest }: SliderFillProps) {
  const ctx = useSliderTrackContext();

  return (
    <span ref={ctx.fillRef} className={cn(ctx.fillClassResolved, className)} {...rest} />
  );
}

SliderFill.displayName = "SliderFill";
