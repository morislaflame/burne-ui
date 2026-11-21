import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
 
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { isRtlElement } from "@/components/core/utils/readingDirection";
import { useMotionPart } from "@/components/core/utils/slotMotion";
 
import { collectTabButtons, focusTabAt } from "./tabsA11y";
import { useTabsListEnter } from "./tabsAnimations";
import {
  useOptionalTabsMotionScope,
  TabsClassNamesProvider,
  TabsListFallbackProvider,
  useTabsClassNames,
  useTabsContext,
} from "./tabsContext";
import { tabsIndicatorClass, tabsIndicatorShape, tabsListClass } from "./tabsStyles";
import type { TabsListProps } from "./tabsTypes";
import { useSlidingTabIndicator } from "./useSlidingTabIndicator";

function collectEnabledTabValues(children: ReactNode, rootDisabled: boolean): string[] {
  if (rootDisabled) return [];
  const values: string[] = [];

  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, (node) => {
      if (!isValidElement(node)) return;
      if (node.type === Fragment) {
        walk((node.props as { children?: ReactNode }).children);
        return;
      }
      const displayName = (node.type as { displayName?: string }).displayName;
      if (displayName === "TabsTab") {
        const props = node.props as {
          value?: string;
          disabled?: boolean;
          "aria-disabled"?: boolean | "true" | "false";
          asChild?: boolean;
          children?: ReactNode;
        };
        const childProps =
          props.asChild && isValidElement(props.children)
            ? (props.children.props as {
                disabled?: boolean;
                "aria-disabled"?: boolean | "true" | "false";
              })
            : undefined;
        const tabDisabled =
          Boolean(props.disabled) ||
          props["aria-disabled"] === true ||
          props["aria-disabled"] === "true" ||
          Boolean(childProps?.disabled) ||
          childProps?.["aria-disabled"] === true ||
          childProps?.["aria-disabled"] === "true";
        if (!tabDisabled && typeof props.value === "string") {
          values.push(props.value);
        }
        return;
      }
      walk((node.props as { children?: ReactNode }).children);
    });
  };

  walk(children);
  return values;
}
 
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
  const { value, setValue, orientation, variant, disabled, activationMode, tabElementsRef, subscribeTabLayout } =
    useTabsContext();
  const slotClassNames = useTabsClassNames();
  const listRef = useRef<HTMLDivElement>(null);
  const scope = useOptionalTabsMotionScope();
  const enabledValues = useMemo(
    () => collectEnabledTabValues(children, disabled),
    [children, disabled],
  );
  const fallbackTabValue =
    value != null && enabledValues.includes(value) ? null : (enabledValues[0] ?? null);
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
    tabsIndicatorShape(variant),
    tabElementsRef,
    subscribeTabLayout,
    scope,
  );

  useLayoutEffect(() => {
    const syncFallbackTabStop = () => {
      const list = listRef.current;
      if (!list || disabled) return;
      const tabs = collectTabButtons(list);
      if (tabs.length === 0) return;
      if (!tabs.some((tab) => tab.tabIndex === 0)) {
        tabs[0]!.tabIndex = 0;
      }
    };
    syncFallbackTabStop();
    return subscribeTabLayout(syncFallbackTabStop);
  }, [disabled, subscribeTabLayout, value]);
 
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
      const rtl = horizontal && isRtlElement(list);
      const forwardKey = rtl ? "ArrowLeft" : "ArrowRight";
      const backwardKey = rtl ? "ArrowRight" : "ArrowLeft";
 
      let nextIndex: number | null = null;
 
      if (horizontal && e.key === forwardKey) {
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length;
      } else if (horizontal && e.key === backwardKey) {
        nextIndex =
          currentIndex < 0 ? tabs.length - 1 : (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (!horizontal && e.key === "ArrowDown") {
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length;
      } else if (!horizontal && e.key === "ArrowUp") {
        nextIndex =
          currentIndex < 0 ? tabs.length - 1 : (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
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
    <TabsListFallbackProvider value={fallbackTabValue}>
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
            orientation,
            slotClass: slotClassNames.indicator,
          })}
          style={{ top: 0, width: 0, height: 0, opacity: 0 }}
        />
        {children}
      </div>
    </TabsListFallbackProvider>
  );
});

TabsListSurface.displayName = "TabsListSurface";

TabsList.displayName = "TabsList";
 
export { TabsTab } from "./tabsTabPart";
export { TabsPanel } from "./tabsPanelPart";
 