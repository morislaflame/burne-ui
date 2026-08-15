import { forwardRef, useCallback, useRef, type KeyboardEvent } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import { useMotionPart } from "@/components/core/utils/slotMotion";

import "@/components/core/utils/glossInteractive.css";

import { collectTabButtons, focusTabAt } from "./tabsA11y";
import { useTabsListEnter } from "./tabsAnimations";
import {
  useOptionalTabsMotionScope,
  useTabsClassNames,
  useTabsContext,
} from "./tabsContext";
import { tabsIndicatorClass, tabsListClass } from "./tabsStyles";
import type { TabsListProps } from "./tabsTypes";
import { useSlidingTabIndicator } from "./useSlidingTabIndicator";

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, onKeyDown, motion, ...rest },
  ref,
) {
  const { value, setValue, orientation, variant, disabled, tabElementsRef, layoutEpoch } =
    useTabsContext();
  const slotClassNames = useTabsClassNames();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const isGloss = variant === "gloss";
  const scope = useOptionalTabsMotionScope();
  const listPart = useMotionPart<HTMLDivElement>({
    scope,
    slot: "list",
    motion,
    pointerPhases: false,
  });

  const bindGlossRef = useMergedGlossPanelRef(ref, isGloss);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      listRef.current = node;
      listPart.setRef(node);
    },
    [bindGlossRef, listPart.setRef],
  );

  useTabsListEnter(scope);

  useSlidingTabIndicator(
    listRef,
    indicatorRef,
    value,
    orientation,
    variant,
    tabElementsRef,
    layoutEpoch,
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;

      const list = listRef.current;
      if (!list) return;

      const tabs = collectTabButtons(list);
      if (tabs.length === 0) return;

      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
      const horizontal = orientation === "horizontal";

      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
          if (horizontal) nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
          if (horizontal) {
            nextIndex =
              currentIndex < 0 ? tabs.length - 1 : (currentIndex - 1 + tabs.length) % tabs.length;
          }
          break;
        case "ArrowDown":
          if (!horizontal) nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length;
          break;
        case "ArrowUp":
          if (!horizontal) {
            nextIndex =
              currentIndex < 0 ? tabs.length - 1 : (currentIndex - 1 + tabs.length) % tabs.length;
          }
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex == null) return;
      e.preventDefault();
      const nextTab = focusTabAt(list, nextIndex);
      const nextValue = nextTab?.dataset.tabValue;
      if (nextValue) setValue(nextValue);
    },
    [disabled, onKeyDown, orientation, setValue],
  );

  return (
    <div
      ref={setRefs}
      role="tablist"
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      className={tabsListClass({
        orientation,
        variant,
        slotClass: slotClassNames.list,
        className,
      })}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className={tabsIndicatorClass({
          variant,
          slotClass: slotClassNames.indicator,
        })}
        style={{ left: 0, top: 0, width: 0, height: 0, opacity: 0 }}
      />
      {children}
    </div>
  );
});

TabsList.displayName = "TabsList";

export { TabsTab } from "./tabsTabPart";
export { TabsPanel } from "./tabsPanelPart";
