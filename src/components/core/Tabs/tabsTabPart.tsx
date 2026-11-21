import {
  Fragment,
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
  type ReactElement,
  type Ref,
} from "react";
 
import { Text } from "@/components/core/Text";
import { dataFlag } from "@/components/core/utils/dataContract";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import {
  mergeMotionRootSiblings,
  mergeMotionSlotMaps,
  useMotionPart,
} from "@/components/core/utils/slotMotion";
 
import { tabsPanelId, tabsTabA11y, tabsTabId } from "./tabsA11y";
import {
  resolveTabsTabMotionDefaults,
  useTabsTabPointerMotion,
  useTabsTabEnter,
  useTabsTabSelectionMotion,
} from "./tabsAnimations";
import {
  TabsMotionProvider,
  useOptionalTabsMotionScope,
  useTabsClassNames,
  useTabsContext,
  useTabsListFallbackValue,
  useTabsMotionScope,
} from "./tabsContext";
import { tabsTabClass, tabsTabTextClass, tabTextVariant } from "./tabsStyles";
import type { TabsTabProps } from "./tabsTypes";
 
export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  { motion, motionController, motionState, motionPayload, playInitialState, ...rest },
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
  const mergedSlots = mergeMotionSlotMaps(
    parentScope?.getRootMotion(),
    motion ? { tab: motion } : undefined,
  );
  const siblings = mergeMotionRootSiblings({
    events: parentScope?.getEvents(),
    states: parentScope?.getStates(),
  });
  const mergedMotion = { ...mergedSlots, ...siblings };
 
  return (
    <TabsMotionProvider motion={mergedMotion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
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
  const fallbackTabValue = useTabsListFallbackValue();
 
  const isSelected = value === tabValue;
  const childElement =
    asChild && isValidElement(children) && children.type !== Fragment
      ? (children as ReactElement<
          ButtonHTMLAttributes<HTMLButtonElement> & {
            ref?: Ref<HTMLElement>;
            "aria-disabled"?: boolean | "true" | "false";
            "data-value"?: string;
          }
        >)
      : null;
  const childDisabled =
    Boolean(childElement?.props.disabled) ||
    childElement?.props["aria-disabled"] === true ||
    childElement?.props["aria-disabled"] === "true";
  const isDisabled = Boolean(rootDisabled || tabDisabled || childDisabled);
  const isTabStop = isSelected || fallbackTabValue === tabValue;
  const tabId = tabsTabId(baseId, tabValue);
  const panelId = tabsPanelId(baseId, tabValue);
  const a11y = tabsTabA11y({ isSelected, isTabStop, isDisabled, panelId });
 
  const { setRef: setTabRef, targetRef: tabTargetRef } = useMotionPart<HTMLElement>({
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
  useTabsTabEnter(scope, tabTargetRef, textPart.targetRef);
  useTabsTabSelectionMotion(scope, isSelected, tabTargetRef, textPart.targetRef);
 
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      setTabRef(node);
      if (node) tabElementsRef.current.set(tabValue, node);
      else tabElementsRef.current.delete(tabValue);
      notifyTabLayout();
      mergeForwardedRef(forwardedRef, node as HTMLButtonElement | null);
    },
    [forwardedRef, notifyTabLayout, setTabRef, tabElementsRef, tabValue],
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
 
  if (childElement) {
    const mergedAsChild = mergeAsChildProps(
      childElement,
      {
        ...rest,
        role: "tab",
        id: tabId,
        "aria-selected": a11y["aria-selected"],
        "aria-controls": a11y["aria-controls"],
        ...(isDisabled ? { disabled: true, "aria-disabled": true } : {}),
        tabIndex: a11y.tabIndex,
        className: tabButtonClassName,
        onClick: (e: MouseEvent<HTMLElement>) => {
          handleClick(e as MouseEvent<HTMLButtonElement>);
        },
        onPointerEnter: pointer.handlePointerEnter,
        onPointerLeave: pointer.handlePointerLeave,
        onPointerDown: pointer.handlePointerDown,
        onPointerUp: pointer.handlePointerUp,
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          pointer.handleKeyDown(e as KeyboardEvent<HTMLButtonElement>);
          if (
            !isDisabled &&
            !e.defaultPrevented &&
            !e.repeat &&
            (e.key === "Enter" || e.key === " " || e.key === "Spacebar") &&
            e.currentTarget.tagName !== "BUTTON"
          ) {
            e.preventDefault();
            e.currentTarget.click();
          }
        },
        "data-value": tabValue,
        "data-disabled": dataFlag(isDisabled),
        "data-state": a11y["aria-selected"] ? "active" : "inactive",
      },
      setRefs,
      { disabled: isDisabled },
    );
    if (isDisabled) mergedAsChild.href = undefined;
    return cloneElement(childElement, mergedAsChild);
  }
 
  return (
    <button
      ref={setRefs as Ref<HTMLButtonElement>}
      type="button"
      role="tab"
      id={tabId}
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
      data-value={tabValue}
      data-disabled={dataFlag(isDisabled)}
      data-state={a11y["aria-selected"] ? "active" : "inactive"}
    >
      <Text
        as="span"
        inheritColor
        ref={textPart.setRef}
        textStyle={tabTextVariant(size)}
        className={tabsTabTextClass(slotClassNames.tabText)}
      >
        {children}
      </Text>
    </button>
  );
}
 
TabsTab.displayName = "TabsTab";
 