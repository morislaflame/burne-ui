import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { clearWillChangeOnComplete, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor, motionInteractiveFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";

import type { TabsOrientation, TabsVariant } from "./tabsTypes";

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

/** Instant layout box — motion uses compositor transforms only. */
function applyIndicatorLayout(indicator: HTMLElement, metrics: IndicatorMetrics) {
  indicator.style.left = `${metrics.left}px`;
  indicator.style.top = `${metrics.top}px`;
  indicator.style.width = `${metrics.width}px`;
  indicator.style.height = `${metrics.height}px`;
}

function clearIndicatorTransform(indicator: HTMLElement) {
  gsap.set(indicator, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: "0 0",
  });
}

/** Visual box while a FLIP tween may still be in flight. */
function readVisualMetrics(
  indicator: HTMLElement,
  layout: IndicatorMetrics,
): IndicatorMetrics {
  const x = Number(gsap.getProperty(indicator, "x")) || 0;
  const y = Number(gsap.getProperty(indicator, "y")) || 0;
  const scaleX = Number(gsap.getProperty(indicator, "scaleX")) || 1;
  const scaleY = Number(gsap.getProperty(indicator, "scaleY")) || 1;
  return {
    left: layout.left + x,
    top: layout.top + y,
    width: layout.width * scaleX,
    height: layout.height * scaleY,
  };
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
  const config = useMotionConfig();
  const firstLayoutRef = useRef(true);
  const layoutMetricsRef = useRef<IndicatorMetrics | null>(null);
  const reduceMotionPreferred = usePrefersReducedMotion();

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    const activeTab = tabElementsRef.current?.get(activeValue);

    if (!list || !indicator || !activeTab) {
      if (indicator) indicator.style.opacity = "0";
      return;
    }

    const to = readIndicatorMetrics(list, activeTab, orientation, variant);
    const reduceMotion =
      reduceMotionPreferred || !isMotionFeatureEnabledFor(config, "enableTabsIndicator");

    indicator.style.opacity = "1";

    const layout = layoutMetricsRef.current;
    const from = layout ? readVisualMetrics(indicator, layout) : to;

    killMotion(indicator);
    applyIndicatorLayout(indicator, to);
    layoutMetricsRef.current = to;

    if (reduceMotion || firstLayoutRef.current) {
      clearIndicatorTransform(indicator);
      return;
    }

    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = to.width > 0 ? from.width / to.width : 1;
    const sy = to.height > 0 ? from.height / to.height : 1;

    setWillChangeTransform(indicator, true);
    gsap.fromTo(
      indicator,
      { x: dx, y: dy, scaleX: sx, scaleY: sy, transformOrigin: "0 0" },
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        ...motionInteractiveFor(config),
        overwrite: "auto",
        onComplete: clearWillChangeOnComplete(indicator),
      },
    );
  }, [
    config,
    activeValue,
    indicatorRef,
    listRef,
    orientation,
    reduceMotionPreferred,
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
