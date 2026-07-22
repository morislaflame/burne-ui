import { forwardRef } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";

import { CalendarClassNamesProvider, CalendarProvider } from "./calendarContext";
import { CalendarDefaultContent, CalendarFooter, CalendarGrid, CalendarHeader } from "./calendarParts";
import { CALENDAR_GLOSS_CONTENT_CLASS, calendarRootClass } from "./calendarStyles";
import type { CalendarProps, UseCalendarRootStateProps } from "./calendarTypes";
import { useCalendarRootState } from "./useCalendarRootState";
import { cn } from "@/utils/cn";

export type {
  CalendarProps,
  CalendarHeaderProps,
  CalendarGridProps,
  CalendarFooterProps,
  CalendarMode,
  CalendarView,
  CalendarVariant,
  CalendarSize,
  CalendarRangeValue,
  CalendarLocale,
  CalendarClassNames,
} from "./calendarTypes";

export { useCalendar } from "./calendarContext";

export const CalendarRoot = forwardRef<HTMLDivElement, CalendarProps>(
  function CalendarRoot(rawProps, ref) {
    const {
      mode: _mode,
      variant: _variant,
      size: _size,
      defaultMonth: _defaultMonth,
      initialView: _initialView,
      locale: _locale,
      minDate: _minDate,
      maxDate: _maxDate,
      navPrevIcon: _navPrevIcon,
      navNextIcon: _navNextIcon,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      classNames,
      children,
      className = "",
      ...rest
    } = rawProps;

    const { isGloss, contextValue } = useCalendarRootState(
      rawProps as UseCalendarRootStateProps,
    );
    const setRootRef = useMergedGlossPanelRef(ref, isGloss);

    const content = children ?? <CalendarDefaultContent />;

    return (
      <CalendarProvider value={contextValue}>
        <CalendarClassNamesProvider classNames={classNames}>
          <div
            ref={setRootRef}
            className={calendarRootClass(
              contextValue.variant,
              contextValue.size,
              isGloss,
              cn("", classNames?.root, className),
            )}
            {...rest}
          >
            {isGloss ? (
              <div className={cn(CALENDAR_GLOSS_CONTENT_CLASS, classNames?.glossContent)}>
                {content}
              </div>
            ) : (
              content
            )}
          </div>
        </CalendarClassNamesProvider>
      </CalendarProvider>
    );
  },
);

CalendarRoot.displayName = "Calendar";

export { CalendarHeader, CalendarGrid, CalendarFooter };
