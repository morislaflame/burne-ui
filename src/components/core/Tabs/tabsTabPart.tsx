import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type Ref,
} from "react";

import { Text } from "@/components/core/Text";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import { tabsPanelId, tabsTabA11y, tabsTabId } from "./tabsA11y";
import { useTabPointerMotion } from "./tabsAnimations";
import { useTabsClassNames, useTabsContext } from "./tabsContext";
import {
  TABS_TAB_AS_CHILD_CLASS,
  tabsTabClass,
  tabsTabTextClass,
  tabTextVariant,
} from "./tabsStyles";
import type { TabsTabProps } from "./tabsTypes";

import { cn } from "@/utils/cn";

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
      ref: (node: HTMLElement | null) => {
        setRefs(node as HTMLButtonElement | null);
        if (child.props.ref) mergeForwardedRef(child.props.ref, node);
      },
      className: cn(child.props.className, TABS_TAB_AS_CHILD_CLASS, className),
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
