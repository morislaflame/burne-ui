import { forwardRef, type ForwardedRef, type ReactNode } from "react";

import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { useOptionalSliderMotionScope, useSliderClassNames, useSliderTrackContext } from "./sliderContext";
import { SLIDER_MARK_CLASS, sliderMarkStyle } from "./sliderStyles";
import { SliderThumbButton } from "./sliderThumbParts";
import type {
  SliderCompoundThumbProps,
  SliderFillProps,
  SliderIconProps,
  SliderRailProps,
  SliderThumbKind,
} from "./sliderTypes";

export function SliderTrackMarks() {
  const ctx = useSliderTrackContext();
  const slotClassNames = useSliderClassNames();

  if (!ctx.markItems.length) return null;

  return (
    <>
      {ctx.markItems.map((item) => (
        <span
          key={item.value}
          aria-hidden
          className={cn(SLIDER_MARK_CLASS, ctx.markSlotClass, slotClassNames.mark)}
          style={sliderMarkStyle(item.percent, ctx.orientation)}
        />
      ))}
    </>
  );
}

SliderTrackMarks.displayName = "SliderTrackMarks";

export function SliderFill({ className, ...rest }: SliderFillProps) {
  const ctx = useSliderTrackContext();
  const slotClassNames = useSliderClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalSliderMotionScope(),
    slot: "fill",
    forwardedRef: ctx.fillRef,
    pointerPhases: true,
  });

  return (
    <span
      ref={setRef}
      className={cn(ctx.fillClassResolved, slotClassNames.fill, className)}
      {...rest}
      {...pointerHandlers}
    />
  );
}

SliderFill.displayName = "SliderFill";

export function SliderRail({ className, children, ...rest }: SliderRailProps) {
  const ctx = useSliderTrackContext();
  const slotClassNames = useSliderClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalSliderMotionScope(),
    slot: "rail",
    pointerPhases: true,
  });

  return (
    <div
      ref={setRef}
      className={cn(ctx.railClass, slotClassNames.rail, className)}
      aria-hidden
      {...rest}
      {...pointerHandlers}
    >
      {children ?? (
        <>
          <SliderFill />
          <SliderTrackMarks />
        </>
      )}
    </div>
  );
}

SliderRail.displayName = "SliderRail";

function SliderTrackThumb({
  kind,
  icon,
  className,
  style,
  forwardedRef,
  motion,
  ...rest
}: {
  kind: SliderThumbKind;
  icon?: ReactNode;
  forwardedRef?: ForwardedRef<HTMLButtonElement>;
} & Omit<SliderCompoundThumbProps, "thumb" | "children">) {
  const ctx = useSliderTrackContext();

  if (kind === "start") {
    return (
      <SliderThumbButton
        ref={forwardedRef}
        size={ctx.size}
        icon={icon}
        gloss={ctx.gloss}
        thumbClassName={ctx.thumbClassName}
        className={className}
        style={style}
        percent={ctx.thumbPercent("start")}
        orientation={ctx.orientation}
        disabled={ctx.disabled}
        active={ctx.activeThumb === "start"}
        ariaValueNow={ctx.rangeValue[0]}
        ariaValueMin={ctx.min}
        ariaValueMax={ctx.rangeValue[1]}
        ariaValueText={ctx.formatValue(ctx.rangeValue[0])}
        {...ctx.resolveThumbA11y("start")}
        onPointerDown={ctx.onThumbPointerDown("start")}
        onKeyDown={ctx.onThumbKeyDown("start")}
        motion={motion}
        {...rest}
      />
    );
  }

  if (kind === "end") {
    return (
      <SliderThumbButton
        ref={forwardedRef}
        size={ctx.size}
        icon={icon}
        gloss={ctx.gloss}
        thumbClassName={ctx.thumbClassName}
        className={className}
        style={style}
        percent={ctx.thumbPercent("end")}
        orientation={ctx.orientation}
        disabled={ctx.disabled}
        active={ctx.activeThumb === "end"}
        ariaValueNow={ctx.rangeValue[1]}
        ariaValueMin={ctx.rangeValue[0]}
        ariaValueMax={ctx.max}
        ariaValueText={ctx.formatValue(ctx.rangeValue[1])}
        {...ctx.resolveThumbA11y("end")}
        onPointerDown={ctx.onThumbPointerDown("end")}
        onKeyDown={ctx.onThumbKeyDown("end")}
        motion={motion}
        {...rest}
      />
    );
  }

  return (
    <SliderThumbButton
      ref={forwardedRef}
      size={ctx.size}
      icon={icon}
      gloss={ctx.gloss}
      thumbClassName={ctx.thumbClassName}
      className={className}
      style={style}
      percent={ctx.thumbPercent("single")}
      orientation={ctx.orientation}
      disabled={ctx.disabled}
      active={ctx.activeThumb === "single"}
      ariaValueNow={ctx.singleValue}
      ariaValueMin={ctx.min}
      ariaValueMax={ctx.max}
      ariaValueText={ctx.formatValue(ctx.singleValue)}
      {...ctx.resolveThumbA11y("single")}
      onPointerDown={ctx.onThumbPointerDown("single")}
      onKeyDown={ctx.onThumbKeyDown("single")}
      motion={motion}
      {...rest}
    />
  );
}

export const SliderCompoundThumb = forwardRef<HTMLButtonElement, SliderCompoundThumbProps>(
  function SliderCompoundThumb(
    { thumb = "single", children, className, style, motion, ...rest },
    ref,
  ) {
    const ctx = useSliderTrackContext();
    return (
      <SliderTrackThumb
        kind={thumb}
        icon={ctx.resolveThumbIcon(children)}
        className={className}
        style={style}
        forwardedRef={ref}
        motion={motion}
        {...rest}
      />
    );
  },
);

SliderCompoundThumb.displayName = "SliderThumb";

export const SliderIcon = forwardRef<HTMLSpanElement, SliderIconProps>(
  function SliderIcon({ children, className, ...rest }, ref) {
    const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalSliderMotionScope(),
      slot: "icon",
      forwardedRef: ref,
      pointerPhases: true,
    });
    return (
      <span ref={setRef} className={className} {...rest} {...pointerHandlers}>
        {children}
      </span>
    );
  },
);

SliderIcon.displayName = "SliderIcon";

export function SliderTrackDefaultBody({
  range,
  icon,
}: {
  range: boolean;
  icon?: ReactNode;
}) {
  return (
    <>
      <SliderRail />
      {range ? (
        <>
          <SliderCompoundThumb thumb="start">
            {icon != null ? <SliderIcon>{icon}</SliderIcon> : null}
          </SliderCompoundThumb>
          <SliderCompoundThumb thumb="end">
            {icon != null ? <SliderIcon>{icon}</SliderIcon> : null}
          </SliderCompoundThumb>
        </>
      ) : (
        <SliderCompoundThumb thumb="single">
          {icon != null ? <SliderIcon>{icon}</SliderIcon> : null}
        </SliderCompoundThumb>
      )}
    </>
  );
}
