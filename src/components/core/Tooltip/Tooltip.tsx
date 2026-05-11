import type { AlertStatus } from "@/components/core/Alert";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { animate, remove } from "animejs";
import { createPortal } from "react-dom";

import {
  SEMANTIC_STATUS_ICONS,
  SEMANTIC_STATUS_ICON_TEXT_CLASS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_TOOLTIP_MS,
} from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

/** Варианты заливки — те же паттерны, что у `Alert` (`ALERT_INLINE_SURFACE_CLASSES`). */
export type TooltipVariant = AlertStatus;

export type TooltipSize = "small" | "base" | "large";

/** Сторона триггера, с которой показывается подсказка. */
export type TooltipSide = "top" | "bottom";

export type TooltipRootProps = {
  children?: ReactNode;
  /** Размер отступов и типографики. По умолчанию `small`. */
  size?: TooltipSize;
  /** Семантика фона как у Alert. По умолчанию `default`. */
  variant?: TooltipVariant;
  /** Задержка перед показом, мс. */
  delayShowMs?: number;
  /** Позиция относительно триггера. По умолчанию `bottom`. */
  side?: TooltipSide;
  /**
   * Иконка слева от текста. Для вариантов `warning`, `danger`, `success`, `info` при отсутствии
   * `icon` используется иконка статуса из `semanticStatusIcons`.
   */
  icon?: ReactNode;
  /**
   * Показать иконку слева. Для semantic-вариантов по умолчанию `true`, для `default` / `outline` — `false`.
   * Явный `false` скрывает и кастомную `icon`, и семантическую.
   */
  showIcon?: boolean;
};

export type TooltipTriggerProps = HTMLAttributes<HTMLSpanElement>;

export type TooltipContentProps = HTMLAttributes<HTMLDivElement>;

const TOOLTIP_INLINE_OUTLINE =
  "border border-border shadow-none bg-surface/65 backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:bg-surface motion-reduce:backdrop-blur-none";

const TOOLTIP_SURFACE: Record<TooltipVariant, string> = {
  default:
    "border border-border bg-surface text-foreground shadow-md",
  outline: `${TOOLTIP_INLINE_OUTLINE} text-foreground shadow-md`,
  danger: "bg-surface-tint-danger text-foreground shadow-md",
  success: "bg-surface-tint-success text-foreground shadow-md",
  info: "bg-surface-tint-info text-foreground shadow-md",
  warning: "bg-surface-tint-warning text-foreground shadow-md",
};

const TOOLTIP_TEXT_SIZE: Record<TooltipSize, string> = {
  small:
    "max-w-[12rem] px-2 py-1 text-xs font-medium leading-snug",
  base: "max-w-[16rem] px-2.5 py-1.5 text-sm font-medium leading-snug",
  large: "max-w-xs px-3 py-2 text-sm font-medium leading-snug",
};

const TOOLTIP_ICON_SIZE: Record<TooltipSize, string> = {
  small: "size-3.5",
  base: "size-4",
  large: "size-[1.125rem]",
};

/** Для кастомной `icon` без собственных классов на `<svg>`. */
const TOOLTIP_ICON_SLOT_SVG: Record<TooltipSize, string> = {
  small: "[&_svg]:size-3.5",
  base: "[&_svg]:size-4",
  large: "[&_svg]:size-[1.125rem]",
};

function isSemanticTooltipVariant(v: TooltipVariant): v is SemanticStatus {
  return (
    v === "danger" ||
    v === "success" ||
    v === "info" ||
    v === "warning"
  );
}

function resolveTooltipLeadingIcon({
  variant,
  size,
  showIcon: showIconProp,
  icon: iconProp,
}: {
  variant: TooltipVariant;
  size: TooltipSize;
  showIcon?: boolean;
  icon?: ReactNode;
}): ReactNode | null {
  if (showIconProp === false) return null;

  if (iconProp !== undefined && iconProp !== null) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 text-foreground [&_svg]:shrink-0",
          TOOLTIP_ICON_SLOT_SVG[size],
        )}
      >
        {iconProp}
      </span>
    );
  }

  const semantic = isSemanticTooltipVariant(variant);
  if (!semantic) return null;

  const Icon = SEMANTIC_STATUS_ICONS[variant];
  return (
    <Icon
      aria-hidden
      className={cn(
        "shrink-0",
        TOOLTIP_ICON_SIZE[size],
        SEMANTIC_STATUS_ICON_TEXT_CLASS[variant],
      )}
    />
  );
}

type TooltipContextValue = {
  open: boolean;
  tooltipId: string;
  variant: TooltipVariant;
  size: TooltipSize;
  side: TooltipSide;
  icon?: ReactNode;
  showIcon?: boolean;
  triggerRef: React.RefObject<HTMLSpanElement | null>;
  scheduleShow: () => void;
  hide: () => void;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(who: string): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error(`${who} должен быть внутри <Tooltip>`);
  }
  return ctx;
}

function TooltipRoot({
  children,
  size = "small",
  variant = "default",
  delayShowMs = 240,
  side = "top",
  icon,
  showIcon,
}: TooltipRootProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (showTimerRef.current !== null) {
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

  return (
    <TooltipContext.Provider value={ctx}>{children}</TooltipContext.Provider>
  );
}

const TooltipTrigger = forwardRef<HTMLSpanElement, TooltipTriggerProps>(
  function TooltipTrigger({ className = "", children, onPointerEnter, onPointerLeave, ...rest }, ref) {
    const { scheduleShow, hide, tooltipId, open, triggerRef } =
      useTooltipContext("Tooltip.Trigger");

    const mergedRef = useCallback(
      (node: HTMLSpanElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref, triggerRef],
    );

    return (
      <span
        ref={mergedRef}
        className={cn("inline-flex shrink-0", className)}
        aria-describedby={open ? tooltipId : undefined}
        onPointerEnter={(e) => {
          scheduleShow();
          onPointerEnter?.(e);
        }}
        onPointerLeave={(e) => {
          hide();
          onPointerLeave?.(e);
        }}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

/** Контент в `createPortal(…, body)` не наследует `data-theme` от обёртки сторибука — копируем с триггера. */
function inheritThemePortalProps(triggerEl: HTMLElement | null): {
  "data-theme"?: "light";
} {
  if (!triggerEl) return {};
  const inherited = triggerEl
    .closest("[data-theme]")
    ?.getAttribute("data-theme");
  return inherited === "light" ? { "data-theme": "light" } : {};
}

function TooltipFloater({
  className = "",
  children,
  ...rest
}: TooltipContentProps) {
  const { open, tooltipId, variant, size, side, icon, showIcon, triggerRef } =
    useTooltipContext("Tooltip.Content");

  const tipRef = useRef<HTMLDivElement | null>(null);
  /** Портал живёт после `open=false`, пока играет fade-out. */
  const [portalMounted, setPortalMounted] = useState(false);

  useLayoutEffect(() => {
    if (open) setPortalMounted(true);
  }, [open]);

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;

    const pad = 8;
    const gap = 8;
    const tr = trigger.getBoundingClientRect();
    const fr = tip.getBoundingClientRect();

    let left = tr.left + tr.width / 2 - fr.width / 2;
    let top: number;

    if (side === "top") {
      top = tr.top - gap - fr.height;
      if (top < pad) {
        top = tr.bottom + gap;
      }
    } else {
      top = tr.bottom + gap;
      if (top + fr.height > window.innerHeight - pad) {
        top = Math.max(pad, tr.top - gap - fr.height);
      }
    }

    left = Math.max(pad, Math.min(left, window.innerWidth - fr.width - pad));

    tip.style.position = "fixed";
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.style.transform = "";
  }, [side, triggerRef]);

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
  }, [open, reposition, children]);

  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = tipRef.current;
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
      animate(el, {
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
    const from =
      Number.isFinite(startOpacity) && startOpacity > 0 ? startOpacity : 1;
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

  const leading = resolveTooltipLeadingIcon({
    variant,
    size,
    showIcon,
    icon,
  });

  const portalTheme = inheritThemePortalProps(triggerRef.current);

  const node = (
    <div
      ref={tipRef}
      {...portalTheme}
      role="tooltip"
      id={tooltipId}
      className={cn(
        "pointer-events-none z-[10000] w-max min-w-0 rounded-lg outline-none will-change-[opacity]",
        TOOLTIP_SURFACE[variant],
        TOOLTIP_TEXT_SIZE[size],
        className,
      )}
      {...rest}
    >
      {leading ? (
        <span className="flex min-w-0 items-center gap-1.5">
          {leading}
          <span className="min-w-0 flex-1">{children}</span>
        </span>
      ) : (
        children
      )}
    </div>
  );

  return createPortal(node, document.body);
}

/** Всплывающая подсказка по hover; паттерны фона совпадают с `Alert`. */
export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipFloater,
});
