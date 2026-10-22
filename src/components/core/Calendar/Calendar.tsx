import { forwardRef, useMemo, type ForwardedRef, type HTMLAttributes } from "react";

import { useMotionPart, useOptionalEnterOnMount } from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { usesKitElevation } from "@/skins/resolveVariantVisual";
import { useSkinRegistryRevision } from "@/skins/skinContext";

import { resolveCalendarMotionDefaults } from "./calendarAnimations";
import { CalendarClassNamesProvider, CalendarMotionProvider, CalendarProvider, useCalendarMotionScope } from "./calendarContext";
import { CalendarDefaultContent } from "./calendarParts";
import { calendarRootClass } from "./calendarStyles";
import type { CalendarProps, UseCalendarRootStateProps } from "./calendarTypes";
import { KIT_CALENDAR_VARIANTS } from "./calendarTypes";
import { useCalendarRootState } from "./useCalendarRootState";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";

export type {
  CalendarProps,
  CalendarHeaderProps,
  CalendarGridProps,
  CalendarFooterProps,
  CalendarNavPrevProps,
  CalendarNavNextProps,
  CalendarTitleProps,
  CalendarDayProps,
  CalendarDayRenderState,
  CalendarRenderDay,
  CalendarMode,
  CalendarView,
  CalendarVariant,
  CalendarSize,
  CalendarRangeValue,
  CalendarLocale,
  CalendarClassNames,
  CalendarMotion,
  CalendarPartMotion,
} from "./calendarTypes";

export { useCalendar } from "./calendarContext";

export const CalendarRoot = forwardRef<HTMLDivElement, CalendarProps>(
  function CalendarRoot(rawProps, ref) {
    const {
      selectionMode: _selectionMode,
      variant: _variant,
      size: _size,
      defaultMonth: _defaultMonth,
      month: _month,
      onMonthChange: _onMonthChange,
      view: _view,
      defaultView: _defaultView,
      onViewChange: _onViewChange,
      locale: _locale,
      minDate: _minDate,
      maxDate: _maxDate,
      isDateUnavailable: _isDateUnavailable,
      previousIcon: _previousIcon,
      nextIcon: _nextIcon,
      renderDay: _renderDay,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      values: _values,
      defaultValues: _defaultValues,
      onValuesChange: _onValuesChange,
      classNames,
      children,
      className = "",
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    } = rawProps;

    const { contextValue } = useCalendarRootState(
      rawProps as UseCalendarRootStateProps,
    );
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveCalendarMotionDefaults(contextValue.variant);
    }, [contextValue.variant, skinRevision]);

    const content = children ?? <CalendarDefaultContent />;

    return (
      <CalendarProvider value={contextValue}>
        <CalendarClassNamesProvider classNames={classNames}>
          <CalendarMotionProvider
            motion={motion}
            defaults={motionDefaults}
            params={{ shadowSize: "base", liftScale: 1 }}
            controller={motionController}
            motionState={motionState}
            motionPayload={motionPayload}
            playInitialState={playInitialState}
          >
          <CalendarRootSurface
            forwardedRef={ref}
            className={calendarRootClass(
              contextValue.variant,
              contextValue.size,
              cn("", classNames?.root, className),
            )}
            rest={rest}
            size={contextValue.size}
            variant={contextValue.variant}
          >
            {content}
          </CalendarRootSurface>
          </CalendarMotionProvider>
        </CalendarClassNamesProvider>
      </CalendarProvider>
    );
  },
);

CalendarRoot.displayName = "Calendar";

function CalendarRootSurface({
  forwardedRef,
  className,
  rest,
  size,
  variant,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  className: string;
  rest: HTMLAttributes<HTMLDivElement>;
  size: CalendarProps["size"];
  variant: string;
  children: CalendarProps["children"];
}) {
  const { onPointerOver, onPointerOut, ...domRest } = rest;
  const scope = useCalendarMotionScope();
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
    forwardedRef,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  useOptionalEnterOnMount(scope, "root", part.targetRef);
  const shadow = useSecondLevelShadow(part.targetRef, usesKitElevation(variant, KIT_CALENDAR_VARIANTS), {
    shadowSize: "base",
    liftScale: 1,
    interactive: false,
    killMotionOnUnmount: false,
  });
  return (
    <div
      ref={part.setRef}
      className={cn(className, shadow.motionClass)}
      {...domRest}
      {...part.pointerHandlers}
      {...dataVariantProps({ size, variant })}
    >
      {children}
    </div>
  );
}

export {
  CalendarHeader,
  CalendarGrid,
  CalendarFooter,
  CalendarNavPrev,
  CalendarNavNext,
  CalendarTitle,
  CalendarDay,
} from "./calendarParts";
