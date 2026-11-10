import { forwardRef, useCallback, useRef, type KeyboardEvent } from "react";
 
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useMotionPart } from "@/components/core/utils/slotMotion";
 
import { collectTabButtons, focusTabAt } from "./tabsA11y";
import { useTabsListEnter } from "./tabsAnimations";
import {
  useOptionalTabsMotionScope,
  TabsClassNamesProvider,
  useTabsClassNames,
  useTabsContext,
} from "./tabsContext";
import { tabsIndicatorClass, tabsListClass } from "./tabsStyles";
import type { TabsListProps } from "./tabsTypes";
import { useSlidingTabIndicator } from "./useSlidingTabIndicator";
 
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, classNames, children, onKeyDown, motion, ...rest },
  ref,
) {
  return (
    <TabsClassNamesProvider classNames={classNames}>
      <TabsListSurface
        ref={ref}
        className={className}
        onKeyDown={onKeyDown}
        motion={motion}
        {...rest}
      >
        {children}
      </TabsListSurface>
    </TabsClassNamesProvider>
  );
});

const TabsListSurface = forwardRef<HTMLDivElement, Omit<TabsListProps, "classNames">>(
  function TabsListSurface({ className, children, onKeyDown, motion, ...rest }, ref) {
  const { value, setValue, orientation, variant, disabled, activationMode, tabElementsRef, layoutEpoch } =
    useTabsContext();
  const slotClassNames = useTabsClassNames();
  const listRef = useRef<HTMLDivElement>(null);
  const scope = useOptionalTabsMotionScope();
  const indicatorPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "indicator",
    pointerPhases: false,
  });
  const { setRef: setListRef } = useMotionPart<HTMLDivElement>({
    scope,
    slot: "list",
    motion,
    pointerPhases: false,
  });
 
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      setListRef(node);
      mergeForwardedRef(ref, node);
    },
    [ref, setListRef],
  );
 
  useTabsListEnter(scope);
 
  useSlidingTabIndicator(
    listRef,
    indicatorPart.targetRef,
    value,
    orientation,
    variant,
    tabElementsRef,
    layoutEpoch,
    scope,
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
      const nextValue = nextTab?.dataset.value;
      if (nextValue && activationMode !== "manual") setValue(nextValue);
    },
    [activationMode, disabled, onKeyDown, orientation, setValue],
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
        ref={indicatorPart.setRef}
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

TabsListSurface.displayName = "TabsListSurface";

TabsList.displayName = "TabsList";
 
export { TabsTab } from "./tabsTabPart";
export { TabsPanel } from "./tabsPanelPart";
 