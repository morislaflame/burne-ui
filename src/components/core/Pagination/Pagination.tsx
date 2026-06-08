import { animate, remove } from "animejs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type MouseEvent,
  type OlHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_HOVER_LIFT_SCALE,
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

type PaginationContextValue = {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount: number;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePagination() {
  const ctx = useContext(PaginationContext);
  if (!ctx) {
    throw new Error("Компоненты Pagination должны быть внутри <Pagination>.");
  }
  return ctx;
}

function useOptionalPagination() {
  return useContext(PaginationContext);
}

const INTERACTIVE_INNER =
  "inline-flex min-w-0 cursor-pointer items-center justify-center gap-xsmall rounded-mid border-0 bg-transparent px-xsmall py-xsmall font-[inherit] text-muted no-underline outline-none " +
  "transition-colors hover:text-foreground motion-reduce:transition-none " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:cursor-not-allowed disabled:opacity-48 disabled:hover:text-muted";

type PaginationInteractiveProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const PaginationInteractive = forwardRef<HTMLButtonElement, PaginationInteractiveProps>(
  function PaginationInteractive(
    { children, className, disabled, onPointerDown, onPointerEnter, onPointerLeave, ...rest },
    ref,
  ) {
    const liftRef = useRef<HTMLSpanElement>(null);
    const hoverInsideRef = useRef(false);

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(e);
        if (disabled) return;
        const el = liftRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        hoverInsideRef.current = true;
        animateInteractiveHoverLift(el, true, MOTION_HOVER_LIFT_SCALE);
      },
      [disabled, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverInsideRef.current = false;
        const el = liftRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, false, MOTION_HOVER_LIFT_SCALE);
      },
      [onPointerLeave],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (disabled || e.defaultPrevented) return;
        const el = liftRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(el).then(() => {
          const shell = liftRef.current;
          if (
            !shell ||
            prefersReducedInteractiveHoverLift() ||
            !hoverInsideRef.current
          ) {
            return;
          }
          animateInteractiveHoverLift(shell, true, MOTION_HOVER_LIFT_SCALE);
        });
      },
      [disabled, onPointerDown],
    );

    return (
      <span
        ref={liftRef}
        className={cn(
          "inline-flex origin-center items-center rounded-mid motion-reduce:animate-none",
          className,
        )}
      >
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          className={INTERACTIVE_INNER}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          {...rest}
        >
          {children}
        </button>
      </span>
    );
  },
);

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children?: ReactNode;
  /** Текущая страница (1-based) для `Pagination.Pages` и навигации по контексту. */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  /** Соседние страницы вокруг текущей в `Pagination.Pages`. */
  siblingCount?: number;
};

export const PaginationRoot = forwardRef<HTMLElement, PaginationProps>(function PaginationRoot(
  {
    children,
    className,
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    "aria-label": ariaLabel = "Пагинация",
    ...rest
  },
  ref,
) {
  const ctxValue = useMemo(
    (): PaginationContextValue => ({
      page,
      totalPages,
      onPageChange,
      siblingCount,
    }),
    [onPageChange, page, siblingCount, totalPages],
  );

  return (
    <PaginationContext.Provider value={ctxValue}>
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          "flex w-full flex-wrap items-center justify-between gap-xsmall gap-y-xsmall text-left",
          className,
        )}
        {...rest}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  );
});

export type PaginationSummaryProps = HTMLAttributes<HTMLDivElement>;

export const PaginationSummary = forwardRef<HTMLDivElement, PaginationSummaryProps>(
  function PaginationSummary({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("min-w-0 flex", className)} {...rest}>
        <Text as="span" variant="small" className="text-muted">
          {children}
        </Text>
      </div>
    );
  },
);

/**
 * FLIP-анимация прямых `<li>` детей: при изменении состава/позиций элементы
 * плавно съезжаются/разъезжаются вместо резкого скачка. Новые элементы
 * проявляются (opacity + scale), существующие — едут из старой позиции в новую.
 */
function usePaginationFlip(olRef: React.RefObject<HTMLOListElement | null>) {
  const prevRectsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const firstRunRef = useRef(true);

  useLayoutEffect(() => {
    const ol = olRef.current;
    if (!ol) return;

    const items = Array.from(ol.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );

    let keylessIndex = 0;
    const keyFor = (el: HTMLElement) =>
      el.dataset.flipKey ?? `__keyless_${keylessIndex++}`;

    const reduceMotion = prefersReducedInteractiveHoverLift();
    const nextRects = new Map<string, { x: number; y: number }>();
    const prevRects = prevRectsRef.current;

    for (const el of items) {
      const key = keyFor(el);
      const rect = el.getBoundingClientRect();
      const pos = { x: rect.left, y: rect.top };
      nextRects.set(key, pos);

      if (reduceMotion || firstRunRef.current) continue;

      const prev = prevRects.get(key);
      if (prev) {
        // Только горизонтальная ось: пагинация — один ряд, элементы
        // съезжаются/разъезжаются по X. Вертикальную дельту игнорируем,
        // чтобы из-за реflow раскладки (шрифты/центрирование) элементы не
        // «выезжали снизу» при первом переключении.
        const dx = prev.x - pos.x;
        if (Math.abs(dx) > 0.5) {
          remove(el);
          el.style.willChange = "transform";
          void animate(el, {
            translateX: [dx, 0],
            duration: MOTION_INTERACTIVE_MS,
            ease: MOTION_INTERACTIVE_EASE,
            onComplete: () => {
              el.style.willChange = "";
            },
          });
        }
      } else {
        remove(el);
        void animate(el, {
          opacity: [0, 1],
          scale: [0.82, 1],
          duration: MOTION_INTERACTIVE_MS,
          ease: MOTION_INTERACTIVE_EASE,
        });
      }
    }

    prevRectsRef.current = nextRects;
    firstRunRef.current = false;
  });

  useLayoutEffect(() => {
    const ol = olRef.current;
    return () => {
      if (!ol) return;
      for (const el of Array.from(ol.children)) {
        if (el instanceof HTMLElement) remove(el);
      }
    };
  }, [olRef]);
}

export type PaginationContentProps = OlHTMLAttributes<HTMLOListElement>;

export const PaginationContent = forwardRef<HTMLOListElement, PaginationContentProps>(
  function PaginationContent({ className, children, ...rest }, ref) {
    const olRef = useRef<HTMLOListElement>(null);

    const setRefs = useCallback(
      (node: HTMLOListElement | null) => {
        olRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    usePaginationFlip(olRef);

    return (
      <ol
        ref={setRefs}
        className={cn(
          "m-0 flex shrink-0 list-none flex-wrap items-center gap-xsmall p-0",
          className,
        )}
        {...rest}
      >
        {children}
      </ol>
    );
  },
);

export type PaginationItemProps = LiHTMLAttributes<HTMLLIElement>;

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  function PaginationItem({ className, children, ...rest }, ref) {
    return (
      <li ref={ref} className={cn("flex items-center", className)} {...rest}>
        {children}
      </li>
    );
  },
);

export type PaginationNavButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationNavButtonProps>(
  function PaginationPrevious(
    { disabled, onClick, children, "aria-label": ariaLabel, ...rest },
    ref,
  ) {
    const ctx = useOptionalPagination();
    const page = ctx?.page;
    const resolvedDisabled = disabled ?? (page != null ? page <= 1 : false);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || resolvedDisabled) return;
        if (ctx?.onPageChange && page != null && page > 1) {
          ctx.onPageChange(page - 1);
        }
      },
      [ctx, onClick, page, resolvedDisabled],
    );

    return (
      <PaginationInteractive
        ref={ref}
        disabled={resolvedDisabled}
        {...(ariaLabel != null ? { "aria-label": ariaLabel } : {})}
        onClick={handleClick}
        {...rest}
      >
        {children ?? (
          <>
            <PaginationPreviousIcon />
            <Text variant="small" inheritColor as="span">
              Назад
            </Text>
          </>
        )}
      </PaginationInteractive>
    );
  },
);

export const PaginationNext = forwardRef<HTMLButtonElement, PaginationNavButtonProps>(
  function PaginationNext(
    { disabled, onClick, children, "aria-label": ariaLabel, ...rest },
    ref,
  ) {
    const ctx = useOptionalPagination();
    const page = ctx?.page;
    const totalPages = ctx?.totalPages;
    const resolvedDisabled =
      disabled ??
      (page != null && totalPages != null ? page >= totalPages : false);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || resolvedDisabled) return;
        if (ctx?.onPageChange && page != null && totalPages != null && page < totalPages) {
          ctx.onPageChange(page + 1);
        }
      },
      [ctx, onClick, page, resolvedDisabled, totalPages],
    );

    return (
      <PaginationInteractive
        ref={ref}
        disabled={resolvedDisabled}
        {...(ariaLabel != null ? { "aria-label": ariaLabel } : {})}
        onClick={handleClick}
        {...rest}
      >
        {children ?? (
          <>
            <Text variant="small" inheritColor as="span">
              Вперёд
            </Text>
            <PaginationNextIcon />
          </>
        )}
      </PaginationInteractive>
    );
  },
);

export function PaginationPreviousIcon({ className }: { className?: string }) {
  return (
    <IoChevronBack
      aria-hidden
      className={cn("shrink-0 icon-small opacity-75", className)}
    />
  );
}

export function PaginationNextIcon({ className }: { className?: string }) {
  return (
    <IoChevronForward
      aria-hidden
      className={cn("shrink-0 icon-small opacity-75", className)}
    />
  );
}

export type PaginationPageProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  page: number;
  isActive?: boolean;
  children?: ReactNode;
};

export const PaginationPage = forwardRef<HTMLButtonElement, PaginationPageProps>(
  function PaginationPage(
    {
      page: pageNumber,
      isActive,
      children,
      onClick,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const ctx = useOptionalPagination();
    const active = isActive ?? (ctx?.page != null ? ctx.page === pageNumber : false);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || active) return;
        ctx?.onPageChange?.(pageNumber);
      },
      [active, ctx, onClick, pageNumber],
    );

    const label = children ?? pageNumber;

    if (active) {
      return (
        <Text
          as="span"
          variant="small"
          aria-current="page"
          className={cn(
            "inline-flex min-w-[1.75rem] items-center justify-center px-xsmall py-xsmall font-medium text-foreground tabular-nums",
            className,
          )}
        >
          {label}
        </Text>
      );
    }

    const pageAriaLabel =
      ariaLabel ?? (children != null ? `Страница ${pageNumber}` : undefined);

    return (
      <PaginationInteractive
        ref={ref}
        {...(pageAriaLabel != null ? { "aria-label": pageAriaLabel } : {})}
        onClick={handleClick}
        className={className}
        {...rest}
      >
        <Text variant="small" inheritColor as="span" className="min-w-[1.75rem] tabular-nums">
          {label}
        </Text>
      </PaginationInteractive>
    );
  },
);

export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  function PaginationEllipsis({ className, ...rest }, ref) {
    return (
      <Text
        ref={ref}
        as="span"
        variant="small"
        aria-hidden
        className={cn(
          "inline-flex min-w-[1.75rem] items-center justify-center px-xsmall py-xsmall text-muted tabular-nums",
          className,
        )}
        {...rest}
      >
        …
      </Text>
    );
  },
);

function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): (number | "ellipsis")[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 2);
  const rightSibling = Math.min(page + siblingCount, totalPages - 1);

  const items: (number | "ellipsis")[] = [1];

  if (leftSibling > 2) items.push("ellipsis");
  else for (let i = 2; i < leftSibling; i++) items.push(i);

  for (let i = leftSibling; i <= rightSibling; i++) items.push(i);

  if (rightSibling < totalPages - 1) items.push("ellipsis");
  else for (let i = rightSibling + 1; i < totalPages; i++) items.push(i);

  items.push(totalPages);
  return items;
}

/** Без props: диапазон берётся из `page` / `totalPages` / `siblingCount` на корневом `<Pagination>`. */
export type PaginationPagesProps = Record<string, never>;

export function PaginationPages() {
    const { page, totalPages, siblingCount } = usePagination();

    if (page == null || totalPages == null) {
      throw new Error(
        "Pagination.Pages требует `page` и `totalPages` на корневом <Pagination>.",
      );
    }

    const range = useMemo(
      () => getPaginationRange(page, totalPages, siblingCount),
      [page, siblingCount, totalPages],
    );

    let ellipsisSeen = 0;

    return (
      <>
        {range.map((item) => {
          if (item === "ellipsis") {
            const side = ellipsisSeen === 0 ? "left" : "right";
            ellipsisSeen += 1;
            const flipKey = `ellipsis-${side}`;
            return (
              <PaginationItem key={flipKey} data-flip-key={flipKey}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={item} data-flip-key={`page-${item}`}>
              <PaginationPage page={item} />
            </PaginationItem>
          );
        })}
      </>
    );
}

/** Пагинация: составной API в стиле `Breadcrumbs` — summary, prev/next, номера страниц. */
PaginationRoot.displayName = "Pagination";
PaginationSummary.displayName = "Pagination.Summary";
PaginationContent.displayName = "Pagination.Content";
PaginationItem.displayName = "Pagination.Item";
PaginationPrevious.displayName = "Pagination.Previous";
PaginationNext.displayName = "Pagination.Next";
PaginationPreviousIcon.displayName = "Pagination.PreviousIcon";
PaginationNextIcon.displayName = "Pagination.NextIcon";
PaginationPage.displayName = "Pagination.Page";
PaginationPages.displayName = "Pagination.Pages";
PaginationEllipsis.displayName = "Pagination.Ellipsis";
