import type { AlertStatus } from "@/components/core/Alert";

import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { createPortal } from "react-dom";

import {
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import { Text, type TextVariant } from "@/components/core/Text";
import {
  messageBannerDescriptionCellClass,
  messageBannerGridClass,
  messageBannerIndicatorCellClass,
  messageBannerTitleCellClass,
  type MessageBannerGridSlots,
} from "@/components/core/utils/messageBannerGridLayout";
import {
  prefersReducedInteractiveHoverLift,
  shadowSm,
} from "@/components/core/utils/hoverInteractiveLift";
import { motionTooltip } from "@/components/core/utils/motionConfig";
import { cn } from "@/utils/cn";

import {
  computeTooltipPlacement,
  TOOLTIP_ARROW_CLASS,
  TOOLTIP_ARROW_SHELL_PAD,
  type TooltipSide,
} from "./tooltipPosition";

export type { TooltipSide };

/** Варианты заливки — как у `Alert`. */
export type TooltipVariant = AlertStatus;

export type TooltipSize = "small" | "base" | "mid" | "large";

const DEFAULT_OFFSET = 8;

export type TooltipRootProps = {
  children?: ReactNode;
  size?: TooltipSize;
  variant?: TooltipVariant;
  delayShowMs?: number;
  /** Предпочтительная сторона. При нехватке места — flip. По умолчанию `top`. */
  side?: TooltipSide;
  icon?: ReactNode;
  showIcon?: boolean;
};

export type TooltipTriggerProps = HTMLAttributes<HTMLSpanElement>;

export type TooltipContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Показать стрелку к триггеру. Можно передать свой `<Tooltip.Arrow />` в children. */
  showArrow?: boolean;
  /** Зазор между триггером и тултипом (px). По умолчанию `8`. */
  offset?: number;
};

export type TooltipArrowProps = HTMLAttributes<HTMLSpanElement>;

const TOOLTIP_SURFACE: Record<TooltipVariant, string> = {
  default: "border-token bg-surface",
  outline: "bg-transparent border-token",
  secondary: "bg-secondary border-token",
  danger: "bg-surface-tint-danger border-token",
  success: "bg-surface-tint-success border-token",
  info: "bg-surface-tint-info border-token",
  warning: "bg-surface-tint-warning border-token",
};

const TOOLTIP_TEXT_LAYOUT: Record<TooltipSize, string> = {
  small: "max-w-[12rem] px-base py-xsmall",
  base: "max-w-[16rem] px-base py-small",
  mid: "max-w-[18rem] px-plus py-small",
  large: "max-w-xs px-plus py-base",
};

const TOOLTIP_CONTENT_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "tools",
  base: "small",
  mid: "small",
  large: "base",
};

const TOOLTIP_ICON_SIZE: Record<TooltipSize, string> = {
  small: "icon-small",
  base: "icon-base",
  mid: "icon-base",
  large: "icon-mid",
};

const TOOLTIP_ICON_SLOT_SVG: Record<TooltipSize, string> = {
  small: "[&_svg]:icon-small",
  base: "[&_svg]:icon-base",
  mid: "[&_svg]:icon-base",
  large: "[&_svg]:icon-mid",
};

const TOOLTIP_ICON_TEXT_CLASS: Record<TooltipVariant, string> = {
  default: "text-foreground",
  outline: "text-foreground",
  secondary: "text-secondary-foreground",
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

function isSemanticTooltipVariant(v: TooltipVariant): v is SemanticStatus {
  return v === "danger" || v === "success" || v === "info" || v === "warning";
}

const TOOLTIP_GRID_GAP: Record<TooltipSize, string> = {
  small: "gap-x-small",
  base: "gap-x-base",
  mid: "gap-x-base",
  large: "gap-x-base",
};

const TOOLTIP_DESC_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "tools",
  base: "tools",
  mid: "tools",
  large: "small",
};

const TOOLTIP_COMPOUND_SLOT_NAMES = new Set([
  "TooltipIndicator",
  "TooltipTitle",
  "TooltipDescription",
]);

function walkTooltipChildren(
  node: ReactNode,
  match: (displayName: string | undefined) => boolean,
): boolean {
  let found = false;

  const walk = (current: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(current)) {
      if (!isValidElement(child)) continue;
      const displayName = (child.type as { displayName?: string }).displayName;
      if (match(displayName)) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(node);
  return found;
}

function hasTooltipCompoundChildren(children: ReactNode): boolean {
  return walkTooltipChildren(
    children,
    (name) => name != null && TOOLTIP_COMPOUND_SLOT_NAMES.has(name),
  );
}

function tooltipHasTitle(children: ReactNode): boolean {
  return walkTooltipChildren(children, (name) => name === "TooltipTitle");
}

function tooltipHasDescription(children: ReactNode): boolean {
  return walkTooltipChildren(children, (name) => name === "TooltipDescription");
}

function tooltipHasIndicator(children: ReactNode): boolean {
  return walkTooltipChildren(children, (name) => name === "TooltipIndicator");
}

function tooltipShowsIndicator(
  variant: TooltipVariant,
  icon: ReactNode | undefined,
  showIcon: boolean | undefined,
  isCompound: boolean,
  compoundHasIndicator: boolean,
): boolean {
  if (showIcon === false) return false;
  if (isCompound) return compoundHasIndicator;
  if (icon != null) return true;
  return isSemanticTooltipVariant(variant);
}

function resolveTooltipGridSlots({
  variant,
  icon,
  showIcon,
  title,
  description,
  isCompound,
  children,
}: {
  variant: TooltipVariant;
  icon?: ReactNode;
  showIcon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  isCompound: boolean;
  children?: ReactNode;
}): MessageBannerGridSlots {
  const hasTitle =
    title != null ||
    (isCompound
      ? tooltipHasTitle(children)
      : children != null && description == null);
  const hasDescription =
    description != null || (isCompound && tooltipHasDescription(children));

  return {
    hasIndicator: tooltipShowsIndicator(
      variant,
      icon,
      showIcon,
      isCompound,
      tooltipHasIndicator(children),
    ),
    hasTitle,
    hasDescription,
    hasAction: false,
    hasClose: false,
  };
}

function resolveTooltipIndicatorInner({
  variant,
  size,
  showIcon,
  icon,
  children,
}: {
  variant: TooltipVariant;
  size: TooltipSize;
  showIcon?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}): ReactNode | null {
  if (children === null) return null;

  if (children !== undefined) return children;

  if (showIcon === false) return null;

  if (icon != null) {
    return icon;
  }

  if (!isSemanticTooltipVariant(variant)) return null;

  const Icon = SEMANTIC_STATUS_ICONS[variant];
  return (
    <Icon
      aria-hidden
      className={cn("shrink-0", TOOLTIP_ICON_SIZE[size], TOOLTIP_ICON_TEXT_CLASS[variant])}
    />
  );
}

type TooltipBodyContextValue = {
  variant: TooltipVariant;
  size: TooltipSize;
  icon?: ReactNode;
  showIcon?: boolean;
  gridSlots: MessageBannerGridSlots;
};

const TooltipBodyContext = createContext<TooltipBodyContextValue | null>(null);

function useTooltipBodyContext(who: string): TooltipBodyContextValue {
  const ctx = useContext(TooltipBodyContext);
  if (!ctx) {
    throw new Error(`${who} должен быть внутри <Tooltip.Panel> или <Tooltip.Content>.`);
  }
  return ctx;
}

export type TooltipPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TooltipVariant;
  size?: TooltipSize;
  icon?: ReactNode;
  showIcon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
};

export type TooltipIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export type TooltipTitleProps = HTMLAttributes<HTMLDivElement>;
export type TooltipDescriptionProps = HTMLAttributes<HTMLDivElement>;

export function TooltipIndicator({
  className = "",
  children,
  ...rest
}: TooltipIndicatorProps) {
  const { variant, size, icon, showIcon, gridSlots } = useTooltipBodyContext("Tooltip.Indicator");
  const inner = resolveTooltipIndicatorInner({
    variant,
    size,
    showIcon,
    icon,
    children,
  });

  if (inner == null) return null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 [&_svg]:shrink-0",
        TOOLTIP_ICON_SLOT_SVG[size],
        TOOLTIP_ICON_TEXT_CLASS[variant],
        messageBannerIndicatorCellClass(gridSlots),
        className,
      )}
      {...rest}
    >
      {inner}
    </span>
  );
}

TooltipIndicator.displayName = "TooltipIndicator";

export function TooltipTitle({ className = "", ...rest }: TooltipTitleProps) {
  const { size, gridSlots } = useTooltipBodyContext("Tooltip.Title");
  return (
    <Text
      as="div"
      variant={TOOLTIP_CONTENT_VARIANT[size]}
      className={cn(messageBannerTitleCellClass(gridSlots), className)}
      {...rest}
    />
  );
}

TooltipTitle.displayName = "TooltipTitle";

export function TooltipDescription({ className = "", ...rest }: TooltipDescriptionProps) {
  const { size, gridSlots } = useTooltipBodyContext("Tooltip.Description");
  return (
    <Text
      as="div"
      variant={TOOLTIP_DESC_VARIANT[size]}
      className={cn(
        "text-muted",
        messageBannerDescriptionCellClass(gridSlots),
        className,
      )}
      {...rest}
    />
  );
}

TooltipDescription.displayName = "TooltipDescription";

function renderTooltipSimpleBody(
  children: ReactNode | undefined,
  title: ReactNode | undefined,
  description: ReactNode | undefined,
  gridSlots: MessageBannerGridSlots,
) {
  if (title != null || description != null) {
    return (
      <>
        {gridSlots.hasIndicator ? <TooltipIndicator /> : null}
        {title != null ? <TooltipTitle>{title}</TooltipTitle> : null}
        {description != null ? (
          <TooltipDescription>{description}</TooltipDescription>
        ) : null}
      </>
    );
  }

  if (children == null) return null;

  if (typeof children === "string" || typeof children === "number") {
    return (
      <>
        {gridSlots.hasIndicator ? <TooltipIndicator /> : null}
        <TooltipTitle>{children}</TooltipTitle>
      </>
    );
  }

  if (isValidElement(children)) {
    return (
      <>
        {gridSlots.hasIndicator ? <TooltipIndicator /> : null}
        <div className={messageBannerTitleCellClass(gridSlots)}>{children}</div>
      </>
    );
  }

  return children;
}

export function TooltipPanel({
  variant = "default",
  size = "base",
  icon,
  showIcon,
  title,
  description,
  className = "",
  children,
  ...rest
}: TooltipPanelProps) {
  const isCompound = children != null && hasTooltipCompoundChildren(children);
  const gridSlots = useMemo(
    () =>
      resolveTooltipGridSlots({
        variant,
        icon,
        showIcon,
        title,
        description,
        isCompound,
        children,
      }),
    [children, description, icon, isCompound, showIcon, title, variant],
  );

  const bodyCtx = useMemo<TooltipBodyContextValue>(
    () => ({ variant, size, icon, showIcon, gridSlots }),
    [gridSlots, icon, showIcon, size, variant],
  );

  return (
    <TooltipBodyContext.Provider value={bodyCtx}>
      <div
        className={cn(
          messageBannerGridClass(gridSlots, TOOLTIP_GRID_GAP[size]),
          "relative z-[1] w-max min-w-0 rounded-mid text-left animate-shadow",
          TOOLTIP_SURFACE[variant],
          TOOLTIP_TEXT_LAYOUT[size],
          className,
        )}
        {...rest}
      >
        {isCompound
          ? children
          : renderTooltipSimpleBody(children, title, description, gridSlots)}
      </div>
    </TooltipBodyContext.Provider>
  );
}

TooltipPanel.displayName = "TooltipPanel";

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}

function mergeDescribedBy(existing: string | undefined, tooltipId: string, open: boolean) {
  if (!open) return existing;
  if (!existing) return tooltipId;
  if (existing.split(/\s+/).includes(tooltipId)) return existing;
  return `${existing} ${tooltipId}`;
}

function isTooltipArrowElement(el: ReactElement): boolean {
  return (el.type as { displayName?: string }).displayName === "TooltipArrow";
}

type TooltipContextValue = {
  open: boolean;
  tooltipId: string;
  variant: TooltipVariant;
  size: TooltipSize;
  side: TooltipSide;
  icon?: ReactNode;
  showIcon?: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  scheduleShow: () => void;
  hide: () => void;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);
const TooltipResolvedSideContext = createContext<TooltipSide>("top");

function useTooltipContext(who: string): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error(`${who} должен быть внутри <Tooltip>.`);
  }
  return ctx;
}

export function TooltipRoot({
  children,
  size = "base",
  variant = "default",
  delayShowMs = 240,
  side = "top",
  icon,
  showIcon,
}: TooltipRootProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (showTimerRef.current != null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const scheduleShow = useCallback(() => {
    clearTimer();
    showTimerRef.current = globalThis.setTimeout(() => {
      showTimerRef.current = null;
      setOpen(true);
    }, delayShowMs);
  }, [clearTimer, delayShowMs]);

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hide, open]);

  const ctx = useMemo<TooltipContextValue>(
    () => ({
      open,
      tooltipId,
      variant,
      size,
      side,
      icon,
      showIcon,
      triggerRef,
      scheduleShow,
      hide,
    }),
    [hide, icon, open, scheduleShow, showIcon, side, size, tooltipId, variant],
  );

  return <TooltipContext.Provider value={ctx}>{children}</TooltipContext.Provider>;
}

TooltipRoot.displayName = "TooltipRoot";

function bindTriggerEvents<T extends HTMLElement>(
  handlers: {
    onPointerEnter?: (e: PointerEvent<T>) => void;
    onPointerLeave?: (e: PointerEvent<T>) => void;
    onFocus?: (e: FocusEvent<T>) => void;
    onBlur?: (e: FocusEvent<T>) => void;
  },
  user?: {
    onPointerEnter?: (e: PointerEvent<T>) => void;
    onPointerLeave?: (e: PointerEvent<T>) => void;
    onFocus?: (e: FocusEvent<T>) => void;
    onBlur?: (e: FocusEvent<T>) => void;
  },
) {
  return {
    onPointerEnter: (e: PointerEvent<T>) => {
      handlers.onPointerEnter?.(e);
      user?.onPointerEnter?.(e);
    },
    onPointerLeave: (e: PointerEvent<T>) => {
      handlers.onPointerLeave?.(e);
      user?.onPointerLeave?.(e);
    },
    onFocus: (e: FocusEvent<T>) => {
      handlers.onFocus?.(e);
      user?.onFocus?.(e);
    },
    onBlur: (e: FocusEvent<T>) => {
      handlers.onBlur?.(e);
      user?.onBlur?.(e);
    },
  };
}

export const TooltipTrigger = forwardRef<HTMLSpanElement, TooltipTriggerProps>(function TooltipTrigger(
  { className = "", children, onPointerEnter, onPointerLeave, onFocus, onBlur, ...rest },
  ref,
) {
  const { scheduleShow, hide, tooltipId, open, triggerRef } = useTooltipContext("Tooltip.Trigger");

  const triggerHandlers = useMemo(
    () => ({
      onPointerEnter: () => scheduleShow(),
      onPointerLeave: () => hide(),
      onFocus: () => scheduleShow(),
      onBlur: () => hide(),
    }),
    [hide, scheduleShow],
  );

  const mergedRef = useCallback(
    (node: HTMLSpanElement | null) => {
      triggerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref, triggerRef],
  );

  const onlyChild = Children.count(children) === 1 && isValidElement(children) ? children : null;

  if (onlyChild) {
    const child = onlyChild as ReactElement<{
      "aria-describedby"?: string;
      onPointerEnter?: (e: PointerEvent<HTMLElement>) => void;
      onPointerLeave?: (e: PointerEvent<HTMLElement>) => void;
      onFocus?: (e: FocusEvent<HTMLElement>) => void;
      onBlur?: (e: FocusEvent<HTMLElement>) => void;
      ref?: Ref<HTMLElement>;
    }>;

    return cloneElement(child, {
      ...bindTriggerEvents(triggerHandlers, {
        onPointerEnter,
        onPointerLeave,
        onFocus,
        onBlur,
      }),
      "aria-describedby": mergeDescribedBy(child.props["aria-describedby"], tooltipId, open),
      ref: mergeRefs(child.props.ref, mergedRef),
    });
  }

  return (
    <span
      ref={mergedRef}
      className={cn("inline-flex shrink-0", className)}
      aria-describedby={open ? tooltipId : undefined}
      tabIndex={rest.tabIndex ?? 0}
      {...bindTriggerEvents(triggerHandlers, {
        onPointerEnter,
        onPointerLeave,
        onFocus,
        onBlur,
      })}
      {...rest}
    >
      {children}
    </span>
  );
});

TooltipTrigger.displayName = "TooltipTrigger";

function inheritThemePortalProps(triggerEl: HTMLElement | null): {
  "data-theme"?: "light";
} {
  if (!triggerEl) return {};
  const inherited = triggerEl.closest("[data-theme]")?.getAttribute("data-theme");
  return inherited === "light" ? { "data-theme": "light" } : {};
}

export function TooltipArrow({ className, ...rest }: TooltipArrowProps) {
  const resolvedSide = useContext(TooltipResolvedSideContext);
  const { variant } = useTooltipContext("Tooltip.Arrow");
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-0 size-2 rotate-45",
        TOOLTIP_SURFACE[variant],
        TOOLTIP_ARROW_CLASS[resolvedSide],
        className,
      )}
      {...rest}
    />
  );
}

TooltipArrow.displayName = "TooltipArrow";

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  {
    className = "",
    children,
    showArrow = false,
    offset = DEFAULT_OFFSET,
    ...rest
  },
  forwardedRef,
) {
  const {
    open,
    tooltipId,
    variant,
    size,
    side,
    icon,
    showIcon,
    triggerRef,
  } = useTooltipContext("Tooltip.Content");

  const tipRef = useRef<HTMLDivElement | null>(null);
  const [portalMounted, setPortalMounted] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<TooltipSide>(side);

  const setTipRef = useCallback(
    (node: HTMLDivElement | null) => {
      tipRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const parts = Children.toArray(children);
  const customArrow = parts.find(
    (child): child is ReactElement => isValidElement(child) && isTooltipArrowElement(child),
  );
  const bodyChildren = parts.filter(
    (child) => !(isValidElement(child) && isTooltipArrowElement(child)),
  );

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;

    const placement = computeTooltipPlacement(
      trigger.getBoundingClientRect(),
      tip.getBoundingClientRect(),
      side,
      offset,
    );

    setResolvedSide(placement.resolvedSide);
    tip.style.position = "fixed";
    tip.style.left = `${placement.left}px`;
    tip.style.top = `${placement.top}px`;
    tip.style.transform = "";
  }, [offset, setResolvedSide, side, triggerRef]);

  useLayoutEffect(() => {
    if (open) setPortalMounted(true);
  }, [open]);

  useEffect(() => {
    const el = tipRef.current;
    if (el) el.style.setProperty("--el-shadow", shadowSm());
  });

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const raf = window.requestAnimationFrame(() => reposition());
    const onReflow = () => reposition();
    window.addEventListener("scroll", onReflow, true);
    window.addEventListener("resize", onReflow);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onReflow, true);
      window.removeEventListener("resize", onReflow);
    };
  }, [open, reposition, children, showArrow, offset]);

  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = tipRef.current;
    if (!el) return undefined;

    const reduced = prefersReducedInteractiveHoverLift();
    let cancelled = false;

    if (reduced) {
      killMotion(el);
      if (open) {
        el.style.opacity = "";
      } else {
        setPortalMounted(false);
      }
      return () => {
        cancelled = true;
      };
    }

    killMotion(el);

    if (open) {
      el.style.opacity = "0";
      void gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ...motionTooltip(), overwrite: "auto" });
      return () => {
        cancelled = true;
        killMotion(el);
      };
    }

    const startOpacity = Number.parseFloat(getComputedStyle(el).opacity);
    const fromAlpha = Number.isFinite(startOpacity) && startOpacity > 0 ? startOpacity : 1;
    const anim = gsap.fromTo(
      el,
      { autoAlpha: fromAlpha },
      { autoAlpha: 0, ...motionTooltip(), overwrite: "auto" },
    );
    void anim.then(() => {
      if (!cancelled) setPortalMounted(false);
    });
    return () => {
      cancelled = true;
      killMotion(el);
    };
  }, [open, portalMounted]);

  if (!portalMounted) return null;
  if (typeof document === "undefined") return null;

  const portalTheme = inheritThemePortalProps(triggerRef.current);

  const bubble = (
    <TooltipPanel variant={variant} size={size} icon={icon} showIcon={showIcon}>
      {bodyChildren.length === 1 ? bodyChildren[0] : bodyChildren}
    </TooltipPanel>
  );

  const node = (
    <TooltipResolvedSideContext.Provider value={resolvedSide}>
      <div
        ref={setTipRef}
        {...portalTheme}
        role="tooltip"
        id={tooltipId}
        data-side={resolvedSide}
        className={cn(
          "pointer-events-none z-[10000] w-max min-w-0 overflow-visible text-left outline-none will-change-[opacity]",
          showArrow && TOOLTIP_ARROW_SHELL_PAD[resolvedSide],
          className,
        )}
        {...rest}
      >
        <div className="relative overflow-visible">
          {showArrow ? (customArrow ?? <TooltipArrow />) : null}
          {bubble}
        </div>
      </div>
    </TooltipResolvedSideContext.Provider>
  );

  return createPortal(node, document.body);
});

TooltipContent.displayName = "TooltipContent";

