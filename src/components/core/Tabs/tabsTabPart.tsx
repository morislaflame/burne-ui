import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type Ref,
} from "react";

import { Text } from "@/components/core/Text";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";

import { tabsPanelId, tabsTabA11y, tabsTabId } from "./tabsA11y";
import {
  resolveTabsTabMotionDefaults,
  useTabsTabPointerMotion,
  useTabsTabSelectionMotion,
} from "./tabsAnimations";
import {
  TabsMotionProvider,
  useOptionalTabsMotionScope,
  useTabsClassNames,
  useTabsContext,
  useTabsMotionScope,
} from "./tabsContext";
import { TABS_TAB_AS_CHILD_CLASS, tabsTabClass, tabsTabTextClass, tabTextVariant } from "./tabsStyles";
import type { TabsTabProps } from "./tabsTypes";

import { cn } from "@/utils/cn";

export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  { motion, ...rest },
  ref,
) {
  const {
    value,
    size,
    variant,
    disabled: rootDisabled,
  } = useTabsContext();
  const tabValue = rest.value;
  const tabDisabled = rest.disabled;
  const isSelected = value === tabValue;
  const isDisabled = rootDisabled || tabDisabled;
  const parentScope = useOptionalTabsMotionScope();
  const motionDefaults = useMemo(
    () => resolveTabsTabMotionDefaults({ selected: isSelected, disabled: !!isDisabled }),
    [isDisabled, isSelected],
  );
  const mergedMotion = mergeMotionSlotMaps(
    parentScope?.getRootMotion(),
    motion ? { tab: motion } : undefined,
  );

  return (
    <TabsMotionProvider motion={mergedMotion} defaults={motionDefaults}>
      <TabsTabSurface forwardedRef={ref} itemMotion={motion} size={size} variant={variant} {...rest} />
    </TabsMotionProvider>
  );
});

function TabsTabSurface({
  value: tabValue,
  children,
  asChild,
  className,
  disabled: tabDisabled,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
  onKeyDown,
  itemMotion,
  forwardedRef,
  size,
  variant,
  ...rest
}: TabsTabProps & {
  itemMotion?: TabsTabProps["motion"];
  forwardedRef: ForwardedRef<HTMLButtonElement>;
  size: ReturnType<typeof useTabsContext>["size"];
  variant: ReturnType<typeof useTabsContext>["variant"];
}) {
  const {
    value,
    setValue,
    baseId,
    disabled: rootDisabled,
    tabElementsRef,
    notifyTabLayout,
  } = useTabsContext();
  const slotClassNames = useTabsClassNames();
  const scope = useTabsMotionScope();

  const isSelected = value === tabValue;
  const isDisabled = rootDisabled || tabDisabled;
  const tabId = tabsTabId(baseId, tabValue);
  const panelId = tabsPanelId(baseId, tabValue);
  const a11y = tabsTabA11y({ isSelected, isDisabled, panelId });

  const tabPart = useMotionPart<HTMLButtonElement>({
    scope,
    slot: "tab",
    motion: itemMotion,
    pointerPhases: false,
  });
  const textPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "tabText",
    pointerPhases: false,
  });
  useTabsTabSelectionMotion(scope, isSelected);

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      tabPart.setRef(node);
      if (node) tabElementsRef.current.set(tabValue, node);
      else tabElementsRef.current.delete(tabValue);
      notifyTabLayout();
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef, notifyTabLayout, tabElementsRef, tabPart.setRef, tabValue],
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

  const pointer = useTabsTabPointerMotion({
    scope,
    isDisabled,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onKeyDown,
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
        pointer.handlePointerEnter(e);
      },
      onPointerLeave: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerLeave?.(e);
        pointer.handlePointerLeave(e);
      },
      onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerDown?.(e);
        pointer.handlePointerDown(e);
      },
      onPointerUp: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerUp?.(e);
        pointer.handlePointerUp(e);
      },
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        child.props.onKeyDown?.(e);
        pointer.handleKeyDown(e);
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
      {...rest}
      onPointerEnter={pointer.handlePointerEnter}
      onPointerLeave={pointer.handlePointerLeave}
      onPointerDown={pointer.handlePointerDown}
      onPointerUp={pointer.handlePointerUp}
      onKeyDown={pointer.handleKeyDown}
    >
      <Text
        as="span"
        inheritColor
        ref={textPart.setRef}
        variant={tabTextVariant(size)}
        className={tabsTabTextClass(slotClassNames.tabText)}
      >
        {children}
      </Text>
    </button>
  );
}

TabsTab.displayName = "TabsTab";
