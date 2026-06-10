import { animate, remove } from "animejs";
import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { motionInteractive } from "@/components/core/utils/motionConfig";

import type { TabsOrientation, TabsVariant } from "./tabsContext";

type IndicatorMetrics = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function readIndicatorMetrics(
  list: HTMLElement,
  tab: HTMLElement,
  orientation: TabsOrientation,
  variant: TabsVariant,
): IndicatorMetrics {
  const listRect = list.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();

  const left = tabRect.left - listRect.left + list.scrollLeft;
  const top = tabRect.top - listRect.top + list.scrollTop;
  const width = tabRect.width;
  const height = tabRect.height;

  if (variant === "default") {
    if (orientation === "horizontal") {
      return { left, top: top + height - 2, width, height: 2 };
    }
    return { left, top, width: 2, height };
  }

  const insetY = variant === "outline" ? 4 : 4;
  const insetX = 4;
  return {
    left: left + insetX,
    top: top + insetY,
    width: Math.max(0, width - insetX * 2),
    height: Math.max(0, height - insetY * 2),
  };
}

function applyIndicatorStyle(indicator: HTMLElement, metrics: IndicatorMetrics) {
  indicator.style.left = `${metrics.left}px`;
  indicator.style.top = `${metrics.top}px`;
  indicator.style.width = `${metrics.width}px`;
  indicator.style.height = `${metrics.height}px`;
}

export function useSlidingTabIndicator(
  listRef: RefObject<HTMLElement | null>,
  indicatorRef: RefObject<HTMLElement | null>,
  activeValue: string,
  orientation: TabsOrientation,
  variant: TabsVariant,
  tabElementsRef: RefObject<Map<string, HTMLButtonElement>>,
  layoutEpoch: number,
) {
  const firstLayoutRef = useRef(true);

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    const activeTab = tabElementsRef.current?.get(activeValue);

    if (!list || !indicator || !activeTab) {
      if (indicator) indicator.style.opacity = "0";
      return;
    }

    const metrics = readIndicatorMetrics(list, activeTab, orientation, variant);
    const reduceMotion = prefersReducedInteractiveHoverLift();

    indicator.style.opacity = "1";

    if (reduceMotion || firstLayoutRef.current) {
      remove(indicator);
      applyIndicatorStyle(indicator, metrics);
      return;
    }

    const fromLeft = indicator.offsetLeft;
    const fromTop = indicator.offsetTop;
    const fromWidth = indicator.offsetWidth;
    const fromHeight = indicator.offsetHeight;

    remove(indicator);
    void animate(indicator, {
      left: [fromLeft, metrics.left],
      top: [fromTop, metrics.top],
      width: [fromWidth, metrics.width],
      height: [fromHeight, metrics.height],
      ...motionInteractive(),
    });
  }, [
    activeValue,
    indicatorRef,
    listRef,
    orientation,
    tabElementsRef,
    variant,
  ]);

  useLayoutEffect(() => {
    updateIndicator();
    firstLayoutRef.current = false;
  }, [updateIndicator]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(list);
    for (const tab of tabElementsRef.current?.values() ?? []) {
      ro.observe(tab);
    }

    return () => ro.disconnect();
  }, [activeValue, layoutEpoch, listRef, tabElementsRef, updateIndicator]);
}
