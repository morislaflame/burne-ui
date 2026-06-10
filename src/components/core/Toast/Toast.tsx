import { animate, remove } from "animejs";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { CloseButton } from "@/components/core/CloseButton";
import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import {
  SEMANTIC_STATUS_ICONS,
} from "@/components/core/utils/semanticStatusIcons";
import { cn } from "@/utils/cn";

import { ToastContext, type ToastContextValue } from "./toastContext";

// ─── types ─────────────────────────────────────────────────────────────────

export type ToastStatus = "default" | "success" | "danger" | "info" | "warning";

export type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AddToastOpts = {
  status?: ToastStatus;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Таймаут в мс. 0 = без автозакрытия. По умолчанию 4000. */
  timeout?: number;
  placement?: ToastPlacement;
  id?: string;
  /** Показывает `Loading` вместо иконки статуса. */
  isLoading?: boolean;
};

export type PromiseToastOpts<T> = {
  loading?: ReactNode;
  success: ReactNode | ((value: T) => ReactNode);
  error?: ReactNode | ((err: unknown) => ReactNode);
  placement?: ToastPlacement;
  timeout?: number;
};

type ToastEntry = {
  id: string;
  status: ToastStatus;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  timeout: number;
  placement: ToastPlacement;
  createdAt: number;
  isLoading: boolean;
};

// ─── constants ─────────────────────────────────────────────────────────────

const STACK_PEEK = 8; // px — how much older toast peeks behind the newer
const STACK_SCALE = 0.04; // scale reduction per stack level
const MAX_VISIBLE = 3;
const DEFAULT_TIMEOUT_MS = 4000;
const TOAST_WIDTH_PX = 360;
const ENTRY_OFFSET_PX = 24;

// ─── per-item context ────────────────────────────────────────────────────────

type ToastItemContextValue = {
  status: ToastStatus;
  titleId: string;
  descriptionId: string;
  isLoading: boolean;
  dismiss: () => void;
};

const ToastItemContext = createContext<ToastItemContextValue | null>(null);

function useToastItem() {
  const ctx = useContext(ToastItemContext);
  if (!ctx) throw new Error("Toast.* must be inside <Toast>.");
  return ctx;
}

// ─── surface styles (same tokens as Alert) ──────────────────────────────────

const TOAST_SURFACE: Record<ToastStatus, string> = {
  default: "border-token bg-surface text-foreground",
  success: "bg-surface-tint-success text-foreground",
  danger: "bg-surface-tint-danger text-foreground",
  info: "bg-surface-tint-info text-foreground",
  warning: "bg-surface-tint-warning text-foreground",
};

const TOAST_ICON_CLASS: Record<ToastStatus, string> = {
  default: "text-primary",
  success: "text-success",
  danger: "text-danger",
  info: "text-info",
  warning: "text-warning",
};

// ─── compound part types ─────────────────────────────────────────────────────

export type ToastProviderProps = {
  children: ReactNode;
  /** Плейсмент по умолчанию. */
  defaultPlacement?: ToastPlacement;
};

export type ToastRootProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  status?: ToastStatus;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  isLoading?: boolean;
  onClose?: () => void;
};

export type ToastIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export type ToastContentProps = HTMLAttributes<HTMLDivElement>;
export type ToastTitleProps = HTMLAttributes<HTMLDivElement>;
export type ToastDescriptionProps = HTMLAttributes<HTMLDivElement>;
export type ToastActionButtonProps = HTMLAttributes<HTMLDivElement>;
export type ToastCloseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label"?: string;
};

// ─── Indicator ───────────────────────────────────────────────────────────────

export function ToastIndicator({ className = "", children, ...rest }: ToastIndicatorProps) {
  const { status, isLoading } = useToastItem();

  if (children !== undefined) {
    return (
      <span className={cn("shrink-0 [&_svg]:icon-mid", TOAST_ICON_CLASS[status], className)} {...rest}>
        {children}
      </span>
    );
  }

  if (isLoading) {
    return (
      <span className={cn("shrink-0", className)} {...rest}>
        <Loading size="base" color="primary" />
      </span>
    );
  }

  if (status === "default") return null;

  const Icon = SEMANTIC_STATUS_ICONS[status as keyof typeof SEMANTIC_STATUS_ICONS];
  if (!Icon) return null;

  return (
    <span className={cn("shrink-0 [&_svg]:icon-mid", TOAST_ICON_CLASS[status], className)} {...rest}>
      <Icon aria-hidden />
    </span>
  );
}

ToastIndicator.displayName = "ToastIndicator";

// ─── Content ─────────────────────────────────────────────────────────────────

export function ToastContent({ className = "", ...rest }: ToastContentProps) {
  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-xsmall text-left", className)} {...rest} />
  );
}

ToastContent.displayName = "ToastContent";

// ─── Title ───────────────────────────────────────────────────────────────────

export function ToastTitle({ className = "", id: idProp, ...rest }: ToastTitleProps) {
  const { titleId } = useToastItem();
  return (
    <Text
      as="div"
      variant="base"
      id={idProp ?? titleId}
      className={cn("font-medium", className)}
      {...rest}
    />
  );
}

ToastTitle.displayName = "ToastTitle";

// ─── Description ─────────────────────────────────────────────────────────────

export function ToastDescription({ className = "", id: idProp, ...rest }: ToastDescriptionProps) {
  const { descriptionId } = useToastItem();
  return (
    <Text
      as="div"
      variant="small"
      id={idProp ?? descriptionId}
      className={cn("text-muted", className)}
      {...rest}
    />
  );
}

ToastDescription.displayName = "ToastDescription";

// ─── ActionButton ─────────────────────────────────────────────────────────────

export function ToastActionButton({ className = "", ...rest }: ToastActionButtonProps) {
  return <div className={cn("shrink-0 self-start", className)} {...rest} />;
}

ToastActionButton.displayName = "ToastActionButton";

// ─── CloseButton ─────────────────────────────────────────────────────────────

export const ToastCloseButton = forwardRef<HTMLButtonElement, ToastCloseButtonProps>(
  function ToastCloseButton(
    { className = "", onClick, "aria-label": ariaLabel = "Закрыть", ...rest },
    ref,
  ) {
    const { dismiss } = useToastItem();
    return (
      <CloseButton
        ref={ref}
        aria-label={ariaLabel}
        className={cn("-m-xsmall shrink-0 self-start", className)}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) dismiss();
        }}
        {...rest}
      />
    );
  },
);

ToastCloseButton.displayName = "ToastCloseButton";

// ─── Toast (visual root) ──────────────────────────────────────────────────────

export const ToastRoot = forwardRef<HTMLDivElement, ToastRootProps>(function ToastRoot(
  {
    status = "default",
    title,
    description,
    action,
    isLoading = false,
    onClose,
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const titleId = `${autoId}-title`;
  const descriptionId = `${autoId}-description`;
  const isCompound = !!children;
  const liveRole = status === "danger" || status === "warning" ? "alert" : "status";

  const itemCtx: ToastItemContextValue = {
    status,
    titleId,
    descriptionId,
    isLoading,
    dismiss: onClose ?? (() => {}),
  };

  return (
    <ToastItemContext.Provider value={itemCtx}>
      <div
        ref={ref}
        role={liveRole}
        aria-labelledby={titleId}
        aria-live={liveRole === "alert" ? "assertive" : "polite"}
        className={cn(
          "flex w-full items-start gap-base rounded-mid py-plus px-mid text-left shadow-token-md",
          TOAST_SURFACE[status],
          className,
        )}
        {...rest}
      >
        {isCompound ? (
          children
        ) : (
          <>
            <ToastIndicator />
            <ToastContent>
              {title != null && <ToastTitle>{title}</ToastTitle>}
              {description != null && <ToastDescription>{description}</ToastDescription>}
            </ToastContent>
            {action != null && <ToastActionButton>{action}</ToastActionButton>}
            {onClose != null && <ToastCloseButton />}
          </>
        )}
      </div>
    </ToastItemContext.Provider>
  );
});

// ─── Animated item wrapper ────────────────────────────────────────────────────

type ToastItemWrapperProps = {
  entry: ToastEntry;
  reverseIdx: number;
  total: number;
  isTop: boolean;
  isDismissing: boolean;
  onDismiss: (id: string) => void;
  onRemoveFinal: (id: string) => void;
  onHeightChange: (id: string, h: number) => void;
};

function ToastItemWrapper({
  entry,
  reverseIdx,
  total,
  isTop,
  isDismissing,
  onDismiss,
  onRemoveFinal,
  onHeightChange,
}: ToastItemWrapperProps) {
  const animRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const capped = Math.min(reverseIdx, MAX_VISIBLE - 1);
  const stackScale = 1 - capped * STACK_SCALE;
  const peekY = isTop ? capped * STACK_PEEK : -capped * STACK_PEEK;
  const stackOpacity = reverseIdx >= MAX_VISIBLE ? 0 : 1;

  // Track height
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      onHeightChange(entry.id, el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [entry.id, onHeightChange]);

  // Entry animation
  useLayoutEffect(() => {
    const el = animRef.current;
    if (!el) return;
    if (prefersReducedInteractiveHoverLift()) {
      el.style.opacity = "1";
      return;
    }
    const slideDir = isTop ? -ENTRY_OFFSET_PX : ENTRY_OFFSET_PX;
    remove(el);
    animate(el, {
      translateY: [slideDir, 0],
      opacity: [0, 1],
      ...motionInteractive(),
    });
  }, [isTop]);

  // Exit animation
  useEffect(() => {
    if (!isDismissing) return;
    const el = animRef.current;
    if (!el) return;
    if (prefersReducedInteractiveHoverLift()) {
      onRemoveFinal(entry.id);
      return;
    }
    const slideDir = isTop ? -ENTRY_OFFSET_PX : ENTRY_OFFSET_PX;
    remove(el);
    void animate(el, {
      translateY: [0, slideDir],
      opacity: [1, 0],
      duration: 220,
      ease: "in(2)",
    }).then(() => onRemoveFinal(entry.id));
  }, [isDismissing, isTop, entry.id, onRemoveFinal]);

  // Auto-dismiss timer
  useEffect(() => {
    if (entry.timeout === 0 || isDismissing || entry.isLoading) return;
    const id = setTimeout(() => onDismiss(entry.id), entry.timeout);
    return () => clearTimeout(id);
  }, [entry.id, entry.timeout, isDismissing, entry.isLoading, onDismiss]);

  const dismiss = useCallback(() => onDismiss(entry.id), [entry.id, onDismiss]);

  const isVisible = reverseIdx < total;

  return (
    <div
      aria-hidden={!isVisible || undefined}
      className="transition-[transform,opacity] duration-normal ease-out"
      style={{
        gridColumn: 1,
        gridRow: 1,
        transform: `translateY(${peekY}px) scale(${stackScale})`,
        transformOrigin: isTop ? "top center" : "bottom center",
        opacity: stackOpacity,
        zIndex: MAX_VISIBLE + 1 - reverseIdx,
        pointerEvents: reverseIdx === 0 ? "auto" : "none",
      }}
    >
      <div
        ref={animRef}
        style={{ opacity: prefersReducedInteractiveHoverLift() ? 1 : 0 }}
      >
        <ToastRoot
          ref={cardRef}
          status={entry.status}
          title={entry.title}
          description={entry.description}
          action={entry.action}
          isLoading={entry.isLoading}
          onClose={dismiss}
        />
      </div>
    </div>
  );
}

// ─── Viewport ─────────────────────────────────────────────────────────────────

const PLACEMENT_CLASS: Record<ToastPlacement, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

type ToastViewportProps = {
  placement: ToastPlacement;
  /** Newest first. */
  sorted: ToastEntry[];
  dismissingIds: Set<string>;
  onDismiss: (id: string) => void;
  onRemoveFinal: (id: string) => void;
};

function ToastViewport({
  placement,
  sorted,
  dismissingIds,
  onDismiss,
  onRemoveFinal,
}: ToastViewportProps) {
  const isTop = placement.startsWith("top");
  const [heights, setHeights] = useState<Map<string, number>>(new Map());

  const onHeightChange = useCallback((id: string, h: number) => {
    setHeights((prev) => {
      const next = new Map(prev);
      next.set(id, h);
      return next;
    });
  }, []);

  // Container height = front toast height + peek offsets for visible extras
  const frontHeight = (sorted[0] && heights.get(sorted[0].id)) ?? 0;
  const extraPeek = Math.min(sorted.length - 1, MAX_VISIBLE - 1) * STACK_PEEK;
  const containerH = frontHeight + extraPeek;

  return (
    <div
      aria-label={`Уведомления (${placement})`}
      className={cn("fixed z-[300] pointer-events-none", PLACEMENT_CLASS[placement])}
      style={{ width: TOAST_WIDTH_PX }}
    >
      <div
        className="relative grid transition-[height] duration-normal"
        style={{
          height: containerH || undefined,
          alignItems: isTop ? "start" : "end",
        }}
      >
        {sorted.map((entry, reverseIdx) => (
          <ToastItemWrapper
            key={entry.id}
            entry={entry}
            reverseIdx={reverseIdx}
            total={sorted.length}
            isTop={isTop}
            isDismissing={dismissingIds.has(entry.id)}
            onDismiss={onDismiss}
            onRemoveFinal={onRemoveFinal}
            onHeightChange={onHeightChange}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProviderRoot({
  children,
  defaultPlacement = "bottom-right",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());

  const add = useCallback(
    (opts: AddToastOpts): string => {
      const id = opts.id ?? `toast-${Math.random().toString(36).slice(2)}`;
      const entry: ToastEntry = {
        id,
        status: opts.status ?? "default",
        title: opts.title,
        description: opts.description,
        action: opts.action,
        timeout: opts.timeout ?? DEFAULT_TIMEOUT_MS,
        placement: opts.placement ?? defaultPlacement,
        createdAt: Date.now(),
        isLoading: opts.isLoading ?? false,
      };
      setToasts((prev) => [...prev, entry]);
      return id;
    },
    [defaultPlacement],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<ToastEntry, "id" | "createdAt">>) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setDismissingIds((prev) => new Set([...prev, id]));
  }, []);

  const removeFinal = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    setDismissingIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }, []);

  // Group active placements
  const placementSet = new Set(toasts.map((t) => t.placement));
  const placements = [...placementSet] as ToastPlacement[];

  const ctx: ToastContextValue = { add, update, dismiss };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {typeof document !== "undefined" &&
        placements.map((placement) =>
          createPortal(
            <ToastViewport
              key={placement}
              placement={placement}
              sorted={toasts
                .filter((t) => t.placement === placement)
                .toSorted((a: ToastEntry, b: ToastEntry) => b.createdAt - a.createdAt)}
              dismissingIds={dismissingIds}
              onDismiss={dismiss}
              onRemoveFinal={removeFinal}
            />,
            document.body,
          ),
        )}
    </ToastContext.Provider>
  );
}

// ─── compound export ──────────────────────────────────────────────────────────

