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
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { animate, remove } from "animejs";
import { createPortal } from "react-dom";

import { FieldHint, type FieldHintProps } from "@/components/core/Field";
import { Text, type TextVariant } from "@/components/core/Text";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import {
  prefersReducedInteractiveHoverLift,
  SHADOW_SM,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_TOOLTIP_MS,
} from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

import {
  computeTooltipPlacement,
  TOOLTIP_ARROW_CLASS,
  TOOLTIP_ARROW_SHELL_PAD,
  type FloatingAlign,
  type TooltipSide,
} from "@/components/core/Tooltip/tooltipPosition";

export type PopoverSide = TooltipSide;
export type PopoverSize = "small" | "base" | "mid" | "large";

const DEFAULT_OFFSET = 8;

const POPOVER_TITLE_VARIANT: Record<PopoverSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const POPOVER_HINT_VARIANT: Record<PopoverSize, TextVariant> = {
  small: "tools",
  base: "small",
  mid: "small",
  large: "base",
};

const POPOVER_MIN_WIDTH: Record<PopoverSize, string> = {
  small: "min-w-[12rem]",
  base: "min-w-[14rem]",
  mid: "min-w-[16rem]",
  large: "min-w-[18rem]",
};

const POPOVER_MAX_WIDTH: Record<PopoverSize, string> = {
  small: "max-w-[16rem]",
  base: "max-w-xs",
  mid: "max-w-sm",
  large: "max-w-md",
};

const POPOVER_PADDING: Record<PopoverSize, string> = {
  small: "p-small",
  base: "p-plus",
  mid: "p-plus",
  large: "p-mid",
};

export type PopoverContentGap = "xsmall" | "small" | "plus" | "mid";

const POPOVER_GAP_CLASS: Record<PopoverContentGap, string> = {
  xsmall: "gap-xsmall",
  small: "gap-small",
  plus: "gap-plus",
  mid: "gap-mid",
};

const POPOVER_DEFAULT_GAP: Record<PopoverSize, PopoverContentGap> = {
  small: "small",
  base: "plus",
  mid: "plus",
  large: "mid",
};

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}

function inheritThemePortalProps(triggerEl: HTMLElement | null): {
  "data-theme"?: "light";
} {
  if (!triggerEl) return {};
  const inherited = triggerEl.closest("[data-theme]")?.getAttribute("data-theme");
  return inherited === "light" ? { "data-theme": "light" } : {};
}

function isPopoverArrowElement(el: ReactElement): boolean {
  return (el.type as { displayName?: string }).displayName === "PopoverArrow";
}

function useControllableOpen(
  openProp: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [internal, setInternal] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internal;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );
  return [open, setOpen] as const;
}

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  popoverId: string;
  labelId: string;
  hintId: string;
  size: PopoverSize;
  side: PopoverSide;
  labelConnected: boolean;
  hintConnected: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  anchorRef?: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);
const PopoverResolvedSideContext = createContext<PopoverSide>("bottom");

function usePopoverContext(who: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error(`${who} должен быть внутри <Popover>.`);
  }
  return ctx;
}

export type PopoverRootProps = {
  children?: ReactNode;
  size?: PopoverSize;
  /** Предпочтительная сторона. При нехватке места — flip. По умолчанию `bottom`. */
  side?: PopoverSide;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Внешний якорь позиционирования (если нет `<Popover.Trigger>`). */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Дополнительная проверка перед закрытием по клику снаружи. */
  shouldDismiss?: (target: Node) => boolean;
};

export function PopoverRoot({
  children,
  size = "base",
  side = "bottom",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  anchorRef,
  shouldDismiss,
}: PopoverRootProps) {
  const [open, setOpen] = useControllableOpen(openProp, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const autoId = useId();
  const popoverId = `popover-${autoId}`;
  const labelId = `${popoverId}-label`;
  const hintId = `${popoverId}-hint`;

  const labelConnected = hasCompoundChild(children, "PopoverLabel");
  const hintConnected = hasCompoundChild(children, "PopoverHint");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const anchor = anchorRef?.current ?? triggerRef.current;
      if (anchor?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      if (shouldDismiss && !shouldDismiss(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchorRef, open, setOpen, shouldDismiss]);

  const ctx = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      popoverId,
      labelId,
      hintId,
      size,
      side,
      labelConnected,
      hintConnected,
      triggerRef,
      anchorRef,
      contentRef,
    }),
    [
      anchorRef,
      hintConnected,
      hintId,
      labelConnected,
      labelId,
      open,
      popoverId,
      setOpen,
      side,
      size,
    ],
  );

  return <PopoverContext.Provider value={ctx}>{children}</PopoverContext.Provider>;
}

PopoverRoot.displayName = "PopoverRoot";

export type PopoverTriggerProps = HTMLAttributes<HTMLButtonElement>;

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(function PopoverTrigger(
  { className = "", children, onClick, ...rest },
  ref,
) {
  const { open, setOpen, triggerRef, popoverId } = usePopoverContext("Popover.Trigger");

  const toggle = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      onClick?.(e as ReactMouseEvent<HTMLButtonElement>);
      if (e.defaultPrevented) return;
      setOpen(!open);
    },
    [onClick, open, setOpen],
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(e as unknown as ReactMouseEvent<HTMLElement>);
      }
    },
    [toggle],
  );

  const mergedRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref, triggerRef],
  );

  const onlyChild = Children.count(children) === 1 && isValidElement(children) ? children : null;

  if (onlyChild) {
    const child = onlyChild as ReactElement<{
      "aria-expanded"?: boolean;
      "aria-controls"?: string;
      onClick?: (e: ReactMouseEvent<HTMLElement>) => void;
      ref?: Ref<HTMLElement>;
    }>;

    return cloneElement(child, {
      onClick: (e: ReactMouseEvent<HTMLElement>) => {
        toggle(e);
        child.props.onClick?.(e);
      },
      "aria-expanded": open,
      "aria-controls": open ? popoverId : undefined,
      ref: mergeRefs(child.props.ref, mergedRef),
    });
  }

  return (
    <button
      type="button"
      ref={mergedRef as Ref<HTMLButtonElement>}
      className={cn("inline-flex shrink-0 border-0 bg-transparent p-0", className)}
      aria-expanded={open}
      aria-controls={open ? popoverId : undefined}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
});

PopoverTrigger.displayName = "PopoverTrigger";

export type PopoverArrowProps = HTMLAttributes<HTMLSpanElement>;

export function PopoverArrow({ className, ...rest }: PopoverArrowProps) {
  const resolvedSide = useContext(PopoverResolvedSideContext);
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-0 size-2 rotate-45 border border-base bg-surface",
        TOOLTIP_ARROW_CLASS[resolvedSide],
        className,
      )}
      {...rest}
    />
  );
}

PopoverArrow.displayName = "PopoverArrow";

export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>;

export function PopoverHeader({ className, children, ...rest }: PopoverHeaderProps) {
  return (
    <div className={cn("flex shrink-0 flex-col gap-xsmall text-left", className)} {...rest}>
      {children}
    </div>
  );
}

PopoverHeader.displayName = "PopoverHeader";

export type PopoverLabelProps = HTMLAttributes<HTMLHeadingElement>;

export const PopoverLabel = forwardRef<HTMLHeadingElement, PopoverLabelProps>(function PopoverLabel(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const { labelId, size } = usePopoverContext("Popover.Label");
  return (
    <Text
      ref={ref as Ref<HTMLElement>}
      as="h2"
      variant={POPOVER_TITLE_VARIANT[size]}
      id={idProp ?? labelId}
      className={cn("min-w-0 font-medium", className)}
      {...rest}
    >
      {children}
    </Text>
  );
});

PopoverLabel.displayName = "PopoverLabel";

export type PopoverHintProps = Omit<FieldHintProps, "id" | "as">;

export function PopoverHint({ className, children, variant, ...rest }: PopoverHintProps) {
  const { hintId, size } = usePopoverContext("Popover.Hint");
  return (
    <FieldHint
      as="p"
      id={hintId}
      variant={variant ?? POPOVER_HINT_VARIANT[size]}
      className={className}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

PopoverHint.displayName = "PopoverHint";

export type PopoverBodyProps = HTMLAttributes<HTMLDivElement>;

export function PopoverBody({ className, children, ...rest }: PopoverBodyProps) {
  return (
    <div className={cn("min-h-0 min-w-0 text-left", className)} {...rest}>
      {children}
    </div>
  );
}

PopoverBody.displayName = "PopoverBody";

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Показать стрелку к триггеру. Можно передать свой `<Popover.Arrow />` в children. */
  showArrow?: boolean;
  /** Зазор между триггером и панелью (px). По умолчанию `8`. */
  offset?: number;
  /** Зазор между `<Popover.Header>` и `<Popover.Body>`. По умолчанию зависит от `size`. */
  gap?: PopoverContentGap;
  /** Минимальная ширина панели = ширина якоря. */
  matchAnchorWidth?: boolean;
  /**
   * Выравнивание вдоль якоря: `start` — левый край под левым краем якоря (дефолт при `matchAnchorWidth`).
   * `center` — по центру (дефолт для обычных popover).
   */
  align?: FloatingAlign;
  /** Без дефолтных min/max-width и padding — для меню и listbox. */
  unstyled?: boolean;
  /** ARIA role оболочки. По умолчанию `dialog`; `undefined` — без role. */
  contentRole?: "dialog" | undefined;
};

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    className = "",
    children,
    showArrow = false,
    offset = DEFAULT_OFFSET,
    gap: gapProp,
    matchAnchorWidth = false,
    align: alignProp,
    unstyled = false,
    contentRole = "dialog",
    ...rest
  },
  forwardedRef,
) {
  const {
    open,
    popoverId,
    size,
    side,
    labelConnected,
    hintConnected,
    labelId,
    hintId,
    triggerRef,
    anchorRef,
    contentRef,
  } = usePopoverContext("Popover.Content");

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [portalMounted, setPortalMounted] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<PopoverSide>(side);

  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      contentRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [contentRef, forwardedRef],
  );

  const parts = Children.toArray(children);
  const customArrow = parts.find(
    (child): child is ReactElement => isValidElement(child) && isPopoverArrowElement(child),
  );
  const panelChildren = parts.filter(
    (child) => !(isValidElement(child) && isPopoverArrowElement(child)),
  );

  const align: FloatingAlign = alignProp ?? (matchAnchorWidth ? "start" : "center");

  const reposition = useCallback(() => {
    const anchor = anchorRef?.current ?? triggerRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const anchorRect = anchor.getBoundingClientRect();
    const placement = computeTooltipPlacement(
      anchorRect,
      panel.getBoundingClientRect(),
      side,
      offset,
      { align },
    );

    setResolvedSide(placement.resolvedSide);
    panel.style.position = "fixed";
    panel.style.left = `${placement.left}px`;
    panel.style.top = `${placement.top}px`;
    panel.style.transform = "";
    if (matchAnchorWidth) {
      panel.style.minWidth = `${Math.max(anchorRect.width, 12 * 16)}px`;
    } else {
      panel.style.minWidth = "";
    }
  }, [align, anchorRef, matchAnchorWidth, offset, setResolvedSide, side, triggerRef]);

  useLayoutEffect(() => {
    if (open) setPortalMounted(true);
  }, [open]);

  useEffect(() => {
    const el = panelRef.current;
    if (el) el.style.setProperty("--el-shadow", SHADOW_SM());
  });

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const raf = window.requestAnimationFrame(() => reposition());
    const onReflow = () => reposition();
    window.addEventListener("scroll", onReflow, true);
    window.addEventListener("resize", onReflow);

    const panel = panelRef.current;
    const ro =
      panel && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => reposition())
        : null;
    if (panel && ro) ro.observe(panel);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onReflow, true);
      window.removeEventListener("resize", onReflow);
      ro?.disconnect();
    };
  }, [open, reposition, showArrow, offset, align, matchAnchorWidth]);

  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = panelRef.current;
    if (!el) return undefined;

    const reduced = prefersReducedInteractiveHoverLift();
    let cancelled = false;

    if (reduced) {
      remove(el);
      if (open) {
        el.style.opacity = "";
      } else {
        setPortalMounted(false);
      }
      return () => {
        cancelled = true;
      };
    }

    remove(el);

    if (open) {
      el.style.opacity = "0";
      void animate(el, {
        opacity: [0, 1],
        duration: MOTION_TOOLTIP_MS,
        ease: MOTION_INTERACTIVE_EASE,
      });
      return () => {
        cancelled = true;
        remove(el);
      };
    }

    const startOpacity = Number.parseFloat(getComputedStyle(el).opacity);
    const from = Number.isFinite(startOpacity) && startOpacity > 0 ? startOpacity : 1;
    const anim = animate(el, {
      opacity: [from, 0],
      duration: MOTION_TOOLTIP_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
    void Promise.resolve(anim).then(() => {
      if (!cancelled) setPortalMounted(false);
    });
    return () => {
      cancelled = true;
      remove(el);
    };
  }, [open, portalMounted]);

  if (!portalMounted) return null;
  if (typeof document === "undefined") return null;

  const portalTheme = inheritThemePortalProps(anchorRef?.current ?? triggerRef.current);

  const describedBy =
    labelConnected && hintConnected
      ? `${labelId} ${hintId}`
      : hintConnected
        ? hintId
        : undefined;

  const contentGap = gapProp ?? POPOVER_DEFAULT_GAP[size];

  const node = (
    <PopoverResolvedSideContext.Provider value={resolvedSide}>
      <div
        ref={setPanelRef}
        {...portalTheme}
        id={popoverId}
        role={contentRole}
        aria-modal={contentRole === "dialog" ? "false" : undefined}
        aria-labelledby={contentRole === "dialog" && labelConnected ? labelId : undefined}
        aria-describedby={contentRole === "dialog" ? describedBy : undefined}
        data-side={resolvedSide}
        className={cn(
          "pointer-events-auto z-[10000] w-max min-w-0 overflow-visible text-left outline-none will-change-[opacity]",
          showArrow && TOOLTIP_ARROW_SHELL_PAD[resolvedSide],
          className,
        )}
        {...rest}
      >
        <div className="relative overflow-visible">
          {showArrow ? (customArrow ?? <PopoverArrow />) : null}
          <div
            className={cn(
              "relative z-[1] flex min-w-0 flex-col overflow-hidden rounded-mid border border-base bg-surface text-foreground animate-shadow",
              !unstyled && POPOVER_MIN_WIDTH[size],
              !unstyled && POPOVER_MAX_WIDTH[size],
              !unstyled && POPOVER_PADDING[size],
              !unstyled && POPOVER_GAP_CLASS[contentGap],
            )}
          >
            {panelChildren}
          </div>
        </div>
      </div>
    </PopoverResolvedSideContext.Provider>
  );

  return createPortal(node, document.body);
});

PopoverContent.displayName = "PopoverContent";

