import {
  cloneElement,
  forwardRef,
  isValidElement,
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
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { Text, type TextVariant } from "@/components/core/Text";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  useMergedGlossPanelRef,
} from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
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
  /** Пробросить пропы на единственного ребёнка (например `<Button />`). */
  asChild?: boolean;
};

export type TabsPanelProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: ReactNode;
};

const LIST_VARIANT_CLASS: Record<TabsVariant, string> = {
  default: "",
  outline: "bg-transparent border-token rounded-mid p-base",
  secondary: "bg-secondary border-token rounded-mid p-base",
  gloss: "border-0 p-base",
};

function isSurfaceTabsVariant(variant: TabsVariant): boolean {
  return variant === "outline" || variant === "secondary" || variant === "gloss";
}

const INDICATOR_VARIANT_CLASS: Record<TabsVariant, string> = {
  default: "bg-primary",
  outline: "bg-secondary",
  secondary: "bg-tertiary",
  gloss: "bg-default-hover",
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

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
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
      className={cn(
        "relative box-border min-w-0 w-fit",
        orientation === "horizontal"
          ? cn(
              "flex flex-row flex-wrap gap-xsmall",
              isSurfaceTabsVariant(variant) ? "items-center" : "items-stretch border-b-token",
            )
          : cn(
              "flex flex-col gap-xsmall",
              isSurfaceTabsVariant(variant) ? "items-start" : "items-stretch border-l-token",
            ),
        isGloss && "gloss-panel rounded-mid text-foreground",
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
  {
    value: tabValue,
    children,
    asChild,
    className = "",
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
  const motionRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isSelected = value === tabValue;
  const isDisabled = rootDisabled || tabDisabled;
  const isSurface = isSurfaceTabsVariant(variant);
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

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || isDisabled || isSelected) return;
      const el = motionRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, getMotionConfig().hoverLiftScale);
    },
    [isDisabled, isSelected, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented || isSelected) return;
      const el = motionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, false, getMotionConfig().hoverLiftScale);
    },
    [isSelected, onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || isDisabled) return;
      const el = motionRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el);
    },
    [isDisabled, onPointerDown],
  );

  const tabButtonClassName = cn(
    "relative z-[1] m-0 inline-flex shrink-0 appearance-none items-center justify-center border-0 bg-transparent outline-none",
    layout.h,
    isSurface ? "rounded-mid px-mid" : layout.padX,
    "focus-ring",
    isDisabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
    isSelected ? "text-primary" : "text-muted hover:text-primary",
    !isSelected && !isDisabled && TEXT_COLOR_TRANSITION,
    className,
  );

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
      "aria-selected": isSelected,
      "aria-controls": panelId,
      tabIndex: isSelected ? 0 : -1,
      disabled: isDisabled || child.props.disabled,
      ref: mergeRefs(setRefs, child.props.ref),
      className: cn(child.props.className, "relative z-[1] shrink-0", className),
      onClick: (e: MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
      onPointerEnter: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerEnter?.(e);
        onPointerEnter?.(e);
      },
      onPointerLeave: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerLeave?.(e);
        onPointerLeave?.(e);
      },
      onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
        child.props.onPointerDown?.(e);
        onPointerDown?.(e);
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
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={isDisabled}
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
      className={cn("min-w-0 outline-none focus-ring", className)}
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
