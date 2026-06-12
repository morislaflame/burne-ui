import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";

import type { TabsOrientation, TabsVariant } from "./tabsContext";

type IndicatorMetrics = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function readListBoxPadding(list: HTMLElement) {
  const cs = getComputedStyle(list);
  return {
    borderTop: Number.parseFloat(cs.borderTopWidth) || 0,
    borderLeft: Number.parseFloat(cs.borderLeftWidth) || 0,
  };
}

function readSurfaceIndicatorMetrics(list: HTMLElement, tab: HTMLElement): IndicatorMetrics {
  const listRect = list.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  const { borderTop, borderLeft } = readListBoxPadding(list);
  const originLeft = listRect.left + borderLeft;
  const originTop = listRect.top + borderTop;

  return {
    left: tabRect.left - originLeft + list.scrollLeft,
    top: tabRect.top - originTop + list.scrollTop,
    width: tabRect.width,
    height: tabRect.height,
  };
}

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

  return readSurfaceIndicatorMetrics(list, tab);
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
      killMotion(indicator);
      applyIndicatorStyle(indicator, metrics);
      return;
    }

    const fromLeft = indicator.offsetLeft;
    const fromTop = indicator.offsetTop;
    const fromWidth = indicator.offsetWidth;
    const fromHeight = indicator.offsetHeight;

    killMotion(indicator);
    gsap.fromTo(
      indicator,
      { left: fromLeft, top: fromTop, width: fromWidth, height: fromHeight },
      { ...metrics, ...motionInteractive(), overwrite: "auto" },
    );
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
