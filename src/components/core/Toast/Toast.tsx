import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  Children,
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
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { CloseButton } from "@/components/core/CloseButton";
import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  createGlossInteractiveRefCallback,
  GLOSS_INTERACTIVE_MOTION_CLASS,
  useGlossInteractiveHandlers,
} from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import { getMotionConfig, motionInteractive } from "@/components/core/utils/motionConfig";
import {
  animatePortalClose,
  animatePortalOpen,
  applyReducedPortalMotion,
  isReducedModalMotion,
  MODAL_PANEL_SCALE_FROM,
} from "@/components/core/utils/modalSurfaceMotion";
import {
  SEMANTIC_STATUS_ICONS,
} from "@/components/core/utils/semanticStatusIcons";
import {
  messageBannerActionCellClass,
  messageBannerCloseCellClass,
  messageBannerDescriptionCellClass,
  messageBannerGridClass,
  messageBannerIndicatorCellClass,
  messageBannerTitleCellClass,
  type MessageBannerGridSlots,
} from "@/components/core/utils/messageBannerGridLayout";
import { cn } from "@/utils/cn";
import { toastScrimToken, TOAST_SCRIM_CSS_VAR } from "@/tokens/toastScrim";

import { ToastContext, type ToastContextValue } from "./toastContext";


export type ToastStatus = "default" | "success" | "danger" | "info" | "warning";
export type ToastVariant = "default" | "gloss";

export type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AddToastOpts = {
  status?: ToastStatus;
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  timeout?: number;
  placement?: ToastPlacement;
  id?: string;
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
  variant: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  timeout: number;
  placement: ToastPlacement;
  createdAt: number;
  isLoading: boolean;
};


const STACK_PEEK = 8; // px — how much older toast peeks behind the newer
const STACK_SCALE = 0.04; // scale reduction per stack level
const MAX_VISIBLE = 3;
const DEFAULT_TIMEOUT_MS = 4000;
const TOAST_WIDTH_PX = 360;
const ENTRY_OFFSET_PX = 24;


type ToastItemContextValue = {
  status: ToastStatus;
  titleId: string;
  descriptionId: string;
  isLoading: boolean;
  dismiss: () => void;
  gridSlots: MessageBannerGridSlots;
};

const ToastItemContext = createContext<ToastItemContextValue | null>(null);

function walkToastChildren(
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

function toastHasTitle(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastTitle");
}

function toastHasDescription(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastDescription");
}

function toastHasIndicator(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastIndicator");
}

function toastHasAction(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastActionButton");
}

function toastHasClose(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastCloseButton");
}

function toastShowsIndicator(
  status: ToastStatus,
  isLoading: boolean,
  isCompound: boolean,
  compoundHasIndicator: boolean,
): boolean {
  if (isCompound) return compoundHasIndicator;
  if (isLoading) return true;
  return status !== "default";
}

function resolveToastGridSlots(
  status: ToastStatus,
  title: ReactNode | undefined,
  description: ReactNode | undefined,
  action: ReactNode | undefined,
  onClose: (() => void) | undefined,
  isLoading: boolean,
  isCompound: boolean,
  children: ReactNode,
): MessageBannerGridSlots {
  const hasTitle = title != null || toastHasTitle(children);
  const hasDescription = description != null || toastHasDescription(children);

  return {
    hasIndicator: toastShowsIndicator(
      status,
      isLoading,
      isCompound,
      toastHasIndicator(children),
    ),
    hasTitle,
    hasDescription,
    hasAction: isCompound ? toastHasAction(children) : action != null,
    hasClose: isCompound ? toastHasClose(children) : onClose != null,
  };
}

function useToastItem() {
  const ctx = useContext(ToastItemContext);
  if (!ctx) throw new Error("Toast.* must be inside <Toast>.");
  return ctx;
}


const TOAST_SURFACE: Record<ToastStatus, string> = {
  default: "bg-surface border-token text-foreground",
  success: "bg-surface-tint-success border-token text-foreground",
  danger: "bg-surface-tint-danger border-token text-foreground",
  info: "bg-surface-tint-info border-token text-foreground",
  warning: "bg-surface-tint-warning border-token text-foreground",
};

const TOAST_ICON_CLASS: Record<ToastStatus, string> = {
  default: "text-primary",
  success: "text-success",
  danger: "text-danger",
  info: "text-info",
  warning: "text-warning",
};


export type ToastProviderProps = {
  children: ReactNode;
  defaultPlacement?: ToastPlacement;
  defaultVariant?: ToastVariant;
};

export type ToastRootProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  status?: ToastStatus;
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  isLoading?: boolean;
  onClose?: () => void;
};

export type ToastIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export type ToastMessageProps = HTMLAttributes<HTMLDivElement>;
export type ToastContentProps = HTMLAttributes<HTMLDivElement>;
export type ToastTitleProps = HTMLAttributes<HTMLDivElement>;
export type ToastDescriptionProps = HTMLAttributes<HTMLDivElement>;
export type ToastActionButtonProps = HTMLAttributes<HTMLDivElement>;
export type ToastCloseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label"?: string;
};


export function ToastIndicator({ className = "", children, ...rest }: ToastIndicatorProps) {
  const { status, isLoading, gridSlots } = useToastItem();

  if (children !== undefined) {
    return (
      <span
        className={cn(
          "[&_svg]:icon-mid",
          TOAST_ICON_CLASS[status],
          messageBannerIndicatorCellClass(gridSlots),
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    );
  }

  if (isLoading) {
    return (
      <span
        className={cn(messageBannerIndicatorCellClass(gridSlots), className)}
        {...rest}
      >
        <Loading size="base" color="primary" />
      </span>
    );
  }

  if (status === "default") return null;

  const Icon = SEMANTIC_STATUS_ICONS[status as keyof typeof SEMANTIC_STATUS_ICONS];
  if (!Icon) return null;

  return (
    <span
      className={cn(
        "[&_svg]:icon-mid",
        TOAST_ICON_CLASS[status],
        messageBannerIndicatorCellClass(gridSlots),
        className,
      )}
      {...rest}
    >
      <Icon aria-hidden />
    </span>
  );
}

ToastIndicator.displayName = "ToastIndicator";


export function ToastMessage({ className = "", ...rest }: ToastMessageProps) {
  return <div className={cn("contents", className)} {...rest} />;
}

ToastMessage.displayName = "ToastMessage";


export function ToastContent({ className = "", ...rest }: ToastContentProps) {
  return <div className={cn("contents", className)} {...rest} />;
}

ToastContent.displayName = "ToastContent";


export function ToastTitle({ className = "", id: idProp, ...rest }: ToastTitleProps) {
  const { titleId, gridSlots } = useToastItem();
  return (
    <Text
      as="div"
      variant="base"
      id={idProp ?? titleId}
      className={cn(
        "font-medium",
        messageBannerTitleCellClass(gridSlots),
        className,
      )}
      {...rest}
    />
  );
}

ToastTitle.displayName = "ToastTitle";


export function ToastDescription({ className = "", id: idProp, ...rest }: ToastDescriptionProps) {
  const { descriptionId, gridSlots } = useToastItem();
  return (
    <Text
      as="div"
      variant="small"
      id={idProp ?? descriptionId}
      className={cn(
        "text-muted",
        messageBannerDescriptionCellClass(gridSlots),
        className,
      )}
      {...rest}
    />
  );
}

ToastDescription.displayName = "ToastDescription";


export function ToastActionButton({ className = "", ...rest }: ToastActionButtonProps) {
  const { gridSlots } = useToastItem();
  return (
    <div
      className={cn(messageBannerActionCellClass(gridSlots), className)}
      {...rest}
    />
  );
}

ToastActionButton.displayName = "ToastActionButton";


export const ToastCloseButton = forwardRef<HTMLButtonElement, ToastCloseButtonProps>(
  function ToastCloseButton(
    { className = "", onClick, "aria-label": ariaLabel = "Закрыть", ...rest },
    ref,
  ) {
    const { dismiss, gridSlots } = useToastItem();
    return (
      <CloseButton
        ref={ref}
        size="small"
        variant="ghost"
        aria-label={ariaLabel}
        className={cn(
          "-mx-xsmall",
          messageBannerCloseCellClass(gridSlots),
          className,
        )}
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


export const ToastRoot = forwardRef<HTMLDivElement, ToastRootProps>(function ToastRoot(
  {
    status = "default",
    variant = "default",
    title,
    description,
    action,
    isLoading = false,
    onClose,
    className = "",
    children,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const titleId = `${autoId}-title`;
  const descriptionId = `${autoId}-description`;
  const isCompound = !!children;
  const liveRole = status === "danger" || status === "warning" ? "alert" : "status";
  const isGloss = variant === "gloss";
  const rootRef = useRef<HTMLDivElement | null>(null);

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, isGloss),
    [isGloss],
  );

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [bindGlossRef, ref],
  );

  const glossPointerHandlers = useGlossInteractiveHandlers(rootRef, isGloss);

  const gridSlots = useMemo(
    () =>
      resolveToastGridSlots(
        status,
        title,
        description,
        action,
        onClose,
        isLoading,
        isCompound,
        children,
      ),
    [action, children, description, isCompound, isLoading, onClose, status, title],
  );

  const itemCtx: ToastItemContextValue = {
    status,
    titleId,
    descriptionId,
    isLoading,
    dismiss: onClose ?? (() => {}),
    gridSlots,
  };

  return (
    <ToastItemContext.Provider value={itemCtx}>
      <div
        ref={setRootRef}
        role={liveRole}
        aria-labelledby={titleId}
        aria-live={liveRole === "alert" ? "assertive" : "polite"}
        className={cn(
          messageBannerGridClass(gridSlots),
          "w-full rounded-mid py-base px-plus",
          isGloss
            ? cn("gloss-panel gloss-deep border-0 text-foreground", GLOSS_INTERACTIVE_MOTION_CLASS)
            : cn("shadow-token-md", TOAST_SURFACE[status]),
          className,
        )}
        onPointerOver={(e) => {
          onPointerOverProp?.(e);
          if (e.defaultPrevented) return;
          if (isGloss) glossPointerHandlers.onPointerOver(e);
        }}
        onPointerOut={(e) => {
          onPointerOutProp?.(e);
          if (isGloss) glossPointerHandlers.onPointerOut(e);
        }}
        {...rest}
      >
        {isCompound ? (
          children
        ) : (
          <>
            {gridSlots.hasIndicator ? <ToastIndicator /> : null}
            {title != null ? <ToastTitle>{title}</ToastTitle> : null}
            {description != null ? (
              <ToastDescription>{description}</ToastDescription>
            ) : null}
            {action != null ? <ToastActionButton>{action}</ToastActionButton> : null}
            {onClose != null ? <ToastCloseButton /> : null}
          </>
        )}
      </div>
    </ToastItemContext.Provider>
  );
});


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
  const stackRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);

  const capped = Math.min(reverseIdx, MAX_VISIBLE - 1);
  const stackScale = 1 - capped * STACK_SCALE;
  const peekY = isTop ? capped * STACK_PEEK : -capped * STACK_PEEK;
  const stackOpacity = reverseIdx >= MAX_VISIBLE ? 0 : 1;

  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const reduceMotion =
      prefersReducedInteractiveHoverLift() || !getMotionConfig().enableToastStack;

    const isFirstMount = !isMountedRef.current;
    isMountedRef.current = true;

    killMotion(el);

    if (reduceMotion) {
      gsap.set(el, {
        y: peekY,
        scale: stackScale,
        autoAlpha: stackOpacity,
      });
      return;
    }

    if (isFirstMount && entry.variant !== "gloss") {
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: stackOpacity, ...motionInteractive(), overwrite: "auto" },
      );
    } else {
      gsap.to(el, {
        y: peekY,
        scale: stackScale,
        autoAlpha: stackOpacity,
        ...motionInteractive(),
        overwrite: "auto",
      });
    }
  }, [peekY, stackScale, stackOpacity]);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    onHeightChange(entry.id, el.offsetHeight);
    const ro = new ResizeObserver(() => {
      onHeightChange(entry.id, el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [entry.id, onHeightChange]);

  useLayoutEffect(() => {
    const el = animRef.current;
    if (!el) return;
    if (isReducedModalMotion()) {
      applyReducedPortalMotion(el);
      return;
    }
    const slideDir = isTop ? -ENTRY_OFFSET_PX : ENTRY_OFFSET_PX;
    animatePortalOpen({
      surface: el,
      vars: { ...motionInteractive(), overwrite: "auto" },
      from: { y: slideDir, scale: MODAL_PANEL_SCALE_FROM },
      to: { y: 0, scale: 1 },
    });
  }, [isTop]);

  useEffect(() => {
    if (!isDismissing) return;
    const el = animRef.current;
    if (!el) return;
    if (isReducedModalMotion()) {
      onRemoveFinal(entry.id);
      return;
    }
    const slideDir = isTop ? -ENTRY_OFFSET_PX : ENTRY_OFFSET_PX;
    killMotion(el);
    animatePortalClose({
      surface: el,
      vars: { duration: 0.22, ease: "power2.in", overwrite: "auto" },
      exit: { y: slideDir },
      onComplete: () => onRemoveFinal(entry.id),
    });
  }, [isDismissing, isTop, entry.id, onRemoveFinal]);

  useEffect(() => {
    if (entry.timeout === 0 || isDismissing || entry.isLoading) return;
    const id = setTimeout(() => onDismiss(entry.id), entry.timeout);
    return () => clearTimeout(id);
  }, [entry.id, entry.timeout, isDismissing, entry.isLoading, onDismiss]);

  const dismiss = useCallback(() => onDismiss(entry.id), [entry.id, onDismiss]);

  const isVisible = reverseIdx < total;

  return (
    <div
      ref={stackRef}
      aria-hidden={!isVisible || undefined}
      className="will-change-transform"
      style={{
        gridColumn: 1,
        gridRow: 1,
        transformOrigin: isTop ? "top center" : "bottom center",
        zIndex: MAX_VISIBLE + 1 - reverseIdx,
        pointerEvents: reverseIdx === 0 ? "auto" : "none",
      }}
    >
      <div ref={animRef}>
        <ToastRoot
          ref={cardRef}
          status={entry.status}
          variant={entry.variant}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const prevContainerHRef = useRef(0);

  const onHeightChange = useCallback((id: string, h: number) => {
    setHeights((prev) => {
      const next = new Map(prev);
      next.set(id, h);
      return next;
    });
  }, []);

  const frontHeight = (sorted[0] && heights.get(sorted[0].id)) ?? 0;
  const extraPeek = Math.min(sorted.length - 1, MAX_VISIBLE - 1) * STACK_PEEK;
  const rawContainerH = frontHeight + extraPeek;
  const containerH = rawContainerH > 0 ? rawContainerH : prevContainerHRef.current;
  if (rawContainerH > 0) prevContainerHRef.current = rawContainerH;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || containerH <= 0) return;

    const reduceMotion =
      prefersReducedInteractiveHoverLift() || !getMotionConfig().enableToastStack;

    killMotion(el);

    if (reduceMotion) {
      el.style.height = `${containerH}px`;
      return;
    }

    gsap.to(el, {
      height: containerH,
      ...motionInteractive(),
      overwrite: "auto",
    });
  }, [containerH]);

  useLayoutEffect(() => {
    const el = scrimRef.current;
    if (el) gsap.set(el, { opacity: 0 });
  }, []);

  useLayoutEffect(() => {
    const el = scrimRef.current;
    if (!el) return;

    const reduceMotion = prefersReducedInteractiveHoverLift();

    const isLastDismissing =
      sorted.length === 1 && dismissingIds.has(sorted[0]?.id ?? "");

    killMotion(el);

    if (reduceMotion) {
      gsap.set(el, { opacity: isLastDismissing ? 0 : 1 });
      return;
    }

    if (isLastDismissing) {
      gsap.to(el, { opacity: 0, duration: 0.22, ease: "power2.in", overwrite: "auto" });
    } else {
      gsap.to(el, { opacity: 1, ...motionInteractive(), overwrite: "auto" });
    }
  }, [sorted, dismissingIds]);

  return (
    <div
      role="region"
      aria-label={`Уведомления (${placement})`}
      className={cn("fixed z-[300] pointer-events-none", PLACEMENT_CLASS[placement])}
      style={{ width: TOAST_WIDTH_PX }}
    >
      {/* Gradient scrim — softens content behind the toast stack, click-through */}
      <div
        ref={scrimRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          [isTop ? "top" : "bottom"]: `calc(-1 * ${toastScrimToken(TOAST_SCRIM_CSS_VAR.offsetY)})`,
          left: `calc(-1 * ${toastScrimToken(TOAST_SCRIM_CSS_VAR.insetX)})`,
          right: `calc(-1 * ${toastScrimToken(TOAST_SCRIM_CSS_VAR.insetX)})`,
          height: toastScrimToken(TOAST_SCRIM_CSS_VAR.height),
          background: isTop
            ? toastScrimToken(TOAST_SCRIM_CSS_VAR.gradientTop)
            : toastScrimToken(TOAST_SCRIM_CSS_VAR.gradientBottom),
          maskImage: toastScrimToken(TOAST_SCRIM_CSS_VAR.mask),
          WebkitMaskImage: toastScrimToken(TOAST_SCRIM_CSS_VAR.mask),
        }}
      />
      <div
        ref={containerRef}
        className="relative grid"
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


export function ToastProviderRoot({
  children,
  defaultPlacement = "bottom-center",
  defaultVariant = "default",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());
  const orderRef = useRef(0);

  const add = useCallback(
    (opts: AddToastOpts): string => {
      const id = opts.id ?? `toast-${Math.random().toString(36).slice(2)}`;
      const entry: ToastEntry = {
        id,
        status: opts.status ?? "default",
        variant: opts.variant ?? defaultVariant,
        title: opts.title,
        description: opts.description,
        action: opts.action,
        timeout: opts.timeout ?? DEFAULT_TIMEOUT_MS,
        placement: opts.placement ?? defaultPlacement,
        createdAt: ++orderRef.current,
        isLoading: opts.isLoading ?? false,
      };
      setToasts((prev) => [...prev, entry]);
      return id;
    },
    [defaultPlacement, defaultVariant],
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
              placement={placement}
              sorted={toasts
                .filter((t) => t.placement === placement)
                .toSorted((a: ToastEntry, b: ToastEntry) => b.createdAt - a.createdAt)}
              dismissingIds={dismissingIds}
              onDismiss={dismiss}
              onRemoveFinal={removeFinal}
            />,
            document.body,
            placement,
          ),
        )}
    </ToastContext.Provider>
  );
}


