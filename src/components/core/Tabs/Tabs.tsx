import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { Text, type TextVariant } from "@/components/core/Text";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { MOTION_HOVER_LIFT_SCALE } from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

import {
  TabsContext,
  type TabsOrientation,
  type TabsVariant,
  useTabsContext,
} from "./tabsContext";
import { useSlidingTabIndicator } from "./useSlidingTabIndicator";

export type TabsSize = ComponentSize;

export type TabsRootProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  /** Контролируемое значение активного таба. */
  value?: string;
  /** Начальное значение (неконтролируемый режим). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  size?: TabsSize;
  variant?: TabsVariant;
  disabled?: boolean;
};

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

export type TabsTabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  children?: ReactNode;
};

export type TabsPanelProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: ReactNode;
};

const LIST_VARIANT_CLASS: Record<TabsVariant, string> = {
  default: "",
  outline: "surface-outline rounded-mid p-xsmall",
  secondary: "surface-secondary rounded-mid p-xsmall",
};

const INDICATOR_VARIANT_CLASS: Record<TabsVariant, string> = {
  default: "bg-accent",
  outline: "bg-accent-fill",
  secondary: "bg-accent-fill-hover",
};

function useMergedTabsValue(
  value: string | undefined,
  defaultValue: string | undefined,
): [string, (next: string) => void, boolean] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value! : internal;
  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [current, setValue, isControlled];
}

function tabTextVariant(size: TabsSize): TextVariant {
  return CONTROL_SIZE_LAYOUT[size].controlText;
}

function collectTabButtons(list: HTMLElement): HTMLButtonElement[] {
  return Array.from(list.querySelectorAll('[role="tab"]:not([disabled])')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
  );
}

function focusTabAt(list: HTMLElement, index: number) {
  const tabs = collectTabButtons(list);
  if (tabs.length === 0) return null;
  const next = tabs[Math.max(0, Math.min(index, tabs.length - 1))]!;
  next.focus();
  return next;
}

export const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  {
    children,
    className = "",
    value: valueProp,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    size = "base",
    variant = "default",
    disabled = false,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const [value, setInternalValue] = useMergedTabsValue(valueProp, defaultValue);
  const tabElementsRef = useRef<Map<string, HTMLButtonElement>>(null!);
  if (!tabElementsRef.current) tabElementsRef.current = new Map();
  const [layoutEpoch, setLayoutEpoch] = useState(0);

  const setValue = useCallback(
    (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange, setInternalValue],
  );

  const notifyTabLayout = useCallback(() => {
    setLayoutEpoch((epoch) => epoch + 1);
  }, []);

  const ctx = {
    value,
    setValue,
    orientation,
    size,
    variant,
    baseId,
    disabled,
    tabElementsRef,
    layoutEpoch,
    notifyTabLayout,
  };

  return (
    <TabsContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cn(
          "flex min-w-0 text-left",
          orientation === "horizontal" ? "flex-col gap-mid" : "flex-row gap-mid",
          className,
        )}
        data-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className = "", children, onKeyDown, ...rest },
  ref,
) {
  const { value, setValue, orientation, variant, disabled, tabElementsRef, layoutEpoch } =
    useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
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
      className={cn(
        "relative box-border min-w-0",
        orientation === "horizontal"
          ? cn("flex flex-row flex-wrap items-stretch gap-xsmall", variant === "default" && "border-b border-base")
          : cn("flex flex-col items-stretch gap-xsmall", variant === "default" && "border-l border-base"),
        LIST_VARIANT_CLASS[variant],
        className,
      )}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-0 motion-reduce:transition-none",
          variant === "default" ? "rounded-full" : "rounded-mid",
          INDICATOR_VARIANT_CLASS[variant],
        )}
        style={{ left: 0, top: 0, width: 0, height: 0, opacity: 0 }}
      />
      {children}
    </div>
  );
});

export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  { value: tabValue, children, className = "", disabled: tabDisabled, onClick, onPointerDown, onPointerEnter, onPointerLeave, ...rest },
  ref,
) {
  const {
    value,
    setValue,
    size,
    baseId,
    disabled: rootDisabled,
    tabElementsRef,
    notifyTabLayout,
  } = useTabsContext();
  const motionRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isSelected = value === tabValue;
  const isDisabled = rootDisabled || tabDisabled;
  const layout = CONTROL_SIZE_LAYOUT[size];
  const tabId = `${baseId}-tab-${tabValue}`;
  const panelId = `${baseId}-panel-${tabValue}`;

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (node) tabElementsRef.current.set(tabValue, node);
      else tabElementsRef.current.delete(tabValue);
      notifyTabLayout();
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [notifyTabLayout, ref, tabElementsRef, tabValue],
  );

  useLayoutEffect(() => {
    return () => {
      tabElementsRef.current.delete(tabValue);
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

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || isDisabled || isSelected) return;
      const el = motionRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, MOTION_HOVER_LIFT_SCALE);
    },
    [isDisabled, isSelected, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented || isSelected) return;
      const el = motionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, false, MOTION_HOVER_LIFT_SCALE);
    },
    [isSelected, onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || isDisabled) return;
      const el = motionRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el);
    },
    [isDisabled, onPointerDown],
  );

  return (
    <button
      ref={setRefs}
      type="button"
      role="tab"
      id={tabId}
      data-tab-value={tabValue}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={isDisabled}
      className={cn(
        "relative z-[1] m-0 inline-flex shrink-0 appearance-none items-center justify-center border-0 bg-transparent outline-none",
        layout.h,
        layout.padX,
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        isDisabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
        isSelected ? "text-accent" : "text-muted hover:text-accent",
        !isSelected && !isDisabled && "transition-colors duration-200 ease-out motion-reduce:transition-none",
        className,
      )}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      <Text
        as="span"
        ref={motionRef}
        variant={tabTextVariant(size)}
        className="inline-flex origin-center items-center gap-xsmall will-change-transform"
      >
        {children}
      </Text>
    </button>
  );
});

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value: panelValue, children, className = "", ...rest },
  ref,
) {
  const { value, baseId } = useTabsContext();
  const isSelected = value === panelValue;
  const tabId = `${baseId}-tab-${panelValue}`;
  const panelId = `${baseId}-panel-${panelValue}`;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      hidden={!isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={cn("min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

TabsRoot.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTab.displayName = "TabsTab";
TabsPanel.displayName = "TabsPanel";

export type { TabsOrientation, TabsVariant };
