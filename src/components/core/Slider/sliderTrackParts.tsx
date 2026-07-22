import type { ReactNode } from "react";

import { useSliderClassNames, useSliderTrackContext } from "./sliderContext";
import { SLIDER_MARK_CLASS, sliderMarkStyle } from "./sliderStyles";
import { SliderThumbButton } from "./sliderThumbParts";
import type {
  SliderCompoundThumbProps,
  SliderFillProps,
  SliderIconProps,
  SliderRailProps,
  SliderThumbKind,
} from "./sliderTypes";

import { cn } from "@/utils/cn";

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

  return (
    <span
      ref={ctx.fillRef}
      className={cn(ctx.fillClassResolved, slotClassNames.fill, className)}
      {...rest}
    />
  );
}

SliderFill.displayName = "SliderFill";

export function SliderRail({ className, children, ...rest }: SliderRailProps) {
  const ctx = useSliderTrackContext();
  const slotClassNames = useSliderClassNames();

  return (
    <div
      className={cn(ctx.railClass, slotClassNames.rail, className)}
      aria-hidden
      {...rest}
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
}: {
  kind: SliderThumbKind;
  icon?: ReactNode;
}) {
  const ctx = useSliderTrackContext();

  if (kind === "start") {
    return (
      <SliderThumbButton
        size={ctx.size}
        icon={icon}
        gloss={ctx.gloss}
        thumbClassName={ctx.thumbClassName}
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
      />
    );
  }

  if (kind === "end") {
    return (
      <SliderThumbButton
        size={ctx.size}
        icon={icon}
        gloss={ctx.gloss}
        thumbClassName={ctx.thumbClassName}
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
      />
    );
  }

  return (
    <SliderThumbButton
      size={ctx.size}
      icon={icon}
      gloss={ctx.gloss}
      thumbClassName={ctx.thumbClassName}
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
    />
  );
}

export function SliderCompoundThumb({ thumb = "single", children }: SliderCompoundThumbProps) {
  const ctx = useSliderTrackContext();
  return <SliderTrackThumb kind={thumb} icon={ctx.resolveThumbIcon(children)} />;
}

SliderCompoundThumb.displayName = "SliderThumb";

export function SliderIcon({ children }: SliderIconProps) {
  return children;
}

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
