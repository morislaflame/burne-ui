import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type Ref,
} from "react";

import { Text } from "@/components/core/Text";
import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";

import "@/components/core/utils/glossInteractive.css";

import { tabsPanelA11y, tabsPanelId, tabsTabA11y, tabsTabId } from "./tabsA11y";
import {
  focusTabAt,
  mergeRefs,
  mergeTabsSlotClass,
  tabTextVariant,
  collectTabButtons,
} from "./tabsAPI";
import { useTabPointerMotion } from "./tabsAnimations";
import { useTabsClassNames, useTabsContext } from "./tabsContext";
import {
  TABS_TAB_AS_CHILD_CLASS,
  tabsIndicatorClass,
  tabsListClass,
  tabsPanelClass,
  tabsTabClass,
  tabsTabTextClass,
} from "./tabsStyles";
import type { TabsListProps, TabsPanelProps, TabsTabProps } from "./tabsTypes";
import { useSlidingTabIndicator } from "./useSlidingTabIndicator";

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, onKeyDown, ...rest },
  ref,
) {
  const { value, setValue, orientation, variant, disabled, tabElementsRef, layoutEpoch } =
    useTabsContext();
  const slotClassNames = useTabsClassNames();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const isGloss = variant === "gloss";

  const bindGlossRef = useMergedGlossPanelRef(ref, isGloss);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      listRef.current = node;
    },
    [bindGlossRef],
  );

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
      tabIndex={disabled ? -1 : 0}
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

export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  {
    value: tabValue,
    children,
    asChild,
    className,
    disabled: tabDisabled,
    onClick,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const {
    value,
    setValue,
    size,
    variant,
    baseId,
    disabled: rootDisabled,
    tabElementsRef,
    notifyTabLayout,
  } = useTabsContext();
  const slotClassNames = useTabsClassNames();
  const motionRef = useRef<HTMLSpanElement>(null);

  const isSelected = value === tabValue;
  const isDisabled = rootDisabled || tabDisabled;
  const tabId = tabsTabId(baseId, tabValue);
  const panelId = tabsPanelId(baseId, tabValue);
  const a11y = tabsTabA11y({ isSelected, isDisabled, panelId });

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node) tabElementsRef.current.set(tabValue, node);
      else tabElementsRef.current.delete(tabValue);
      notifyTabLayout();
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [notifyTabLayout, ref, tabElementsRef, tabValue],
  );

  useLayoutEffect(() => {
    const tabElements = tabElementsRef.current;
    return () => {
      tabElements.delete(tabValue);
      notifyTabLayout();
    };
  }, [notifyTabLayout, tabElementsRef, tabValue]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || isDisabled) return;
      setValue(tabValue);
    },
    [isDisabled, onClick, setValue, tabValue],
  );

  const { handlePointerEnter, handlePointerLeave, handlePointerDown } = useTabPointerMotion({
    motionRef,
    isDisabled,
    isSelected,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  });

  const tabButtonClassName = tabsTabClass({
    size,
    variant,
    isSelected,
    isDisabled,
    slotClass: slotClassNames.tab,
    className,
  });

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<
      ButtonHTMLAttributes<HTMLButtonElement> & {
        ref?: Ref<HTMLElement>;
        "data-tab-value"?: string;
      }
    >;

    return cloneElement(child, {
      ...rest,
      role: "tab",
      id: tabId,
      "data-tab-value": tabValue,
      "aria-selected": a11y["aria-selected"],
      "aria-controls": a11y["aria-controls"],
      tabIndex: a11y.tabIndex,
      disabled: isDisabled || child.props.disabled,
      ref: mergeRefs(setRefs, child.props.ref),
      className: mergeTabsSlotClass(child.props.className, TABS_TAB_AS_CHILD_CLASS, className),
      onClick: (e: MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
      onPointerEnter: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerEnter?.(e);
        handlePointerEnter(e);
      },
      onPointerLeave: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerLeave?.(e);
        handlePointerLeave(e);
      },
      onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerDown?.(e);
        handlePointerDown(e);
      },
    });
  }

  return (
    <button
      ref={setRefs}
      type="button"
      role="tab"
      id={tabId}
      data-tab-value={tabValue}
      aria-selected={a11y["aria-selected"]}
      aria-controls={a11y["aria-controls"]}
      tabIndex={a11y.tabIndex}
      disabled={a11y.disabled}
      className={tabButtonClassName}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      <Text
        as="span"
        inheritColor
        ref={motionRef}
        variant={tabTextVariant(size)}
        className={tabsTabTextClass(slotClassNames.tabText)}
      >
        {children}
      </Text>
    </button>
  );
});

TabsTab.displayName = "TabsTab";

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value: panelValue, children, className, ...rest },
  ref,
) {
  const { value, baseId } = useTabsContext();
  const slotClassNames = useTabsClassNames();
  const isSelected = value === panelValue;
  const tabId = tabsTabId(baseId, panelValue);
  const panelId = tabsPanelId(baseId, panelValue);
  const a11y = tabsPanelA11y({ isSelected, tabId });

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId}
      aria-labelledby={a11y["aria-labelledby"]}
      hidden={a11y.hidden}
      tabIndex={a11y.tabIndex}
      className={tabsPanelClass({
        slotClass: slotClassNames.panel,
        className,
      })}
      {...rest}
    >
      {children}
    </div>
  );
});

TabsPanel.displayName = "TabsPanel";
